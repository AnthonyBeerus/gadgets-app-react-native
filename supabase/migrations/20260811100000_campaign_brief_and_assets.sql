-- Campaign brief schema.
--
-- Turns public.challenges into a UGC campaign brief matching the industry-standard
-- shape (goal, format + platform specs, brand assets, talking points, do's/don'ts,
-- deliverable count, deadline, usage rights, revision policy, review SLA), and turns
-- challenge_submissions into an uploaded-asset entry rather than a TikTok link.
--
-- Note on deadline: the live column is TEXT, not timestamptz. All 139 existing rows
-- hold parseable ISO timestamps, so the cast below is safe. Without this, none of the
-- "deadline > now()" feed filtering in later migrations can work.

begin;

-- ---------------------------------------------------------------------------
-- challenges -> campaign brief
-- ---------------------------------------------------------------------------

alter table public.challenges
  alter column deadline type timestamptz using deadline::timestamptz;

alter table public.challenges
  add column if not exists campaign_goal text,
  add column if not exists content_format text not null default 'video',
  add column if not exists deliverable_count integer not null default 1,
  add column if not exists video_min_seconds integer,
  add column if not exists video_max_seconds integer,
  add column if not exists talking_points text[] not null default '{}',
  add column if not exists dos text[] not null default '{}',
  add column if not exists donts text[] not null default '{}',
  add column if not exists brand_asset_paths text[] not null default '{}',
  add column if not exists usage_rights text not null default 'organic_social_12m',
  add column if not exists revisions_allowed integer not null default 1,
  add column if not exists review_sla_days integer not null default 5,
  add column if not exists published_at timestamptz,
  add column if not exists closed_at timestamptz;

alter table public.challenges
  drop constraint if exists challenges_campaign_goal_check,
  drop constraint if exists challenges_content_format_check,
  drop constraint if exists challenges_deliverable_count_check,
  drop constraint if exists challenges_usage_rights_check,
  drop constraint if exists challenges_revisions_allowed_check,
  drop constraint if exists challenges_review_sla_days_check;

alter table public.challenges
  add constraint challenges_campaign_goal_check
    check (campaign_goal is null or campaign_goal in ('awareness','product_launch','ugc_library','conversions')),
  add constraint challenges_content_format_check
    check (content_format in ('video','photo','either')),
  add constraint challenges_deliverable_count_check
    check (deliverable_count between 1 and 10),
  add constraint challenges_usage_rights_check
    check (usage_rights in ('none','organic_social_12m','paid_ads_12m','perpetual_all_media')),
  add constraint challenges_revisions_allowed_check
    check (revisions_allowed between 0 and 5),
  add constraint challenges_review_sla_days_check
    check (review_sla_days between 1 and 30);

-- Status machine: draft -> published -> closed -> settled.
-- The partial unique index below is predicated on status = 'active', so it has to go
-- before the backfill or the rename silently changes which rows it covers.
drop index if exists public.challenges_active_product_sponsorship_idx;

update public.challenges
set status = case
  when settled_at is not null or status = 'completed' then 'settled'
  when status in ('active','open','live') then 'published'
  when status in ('draft','published','closed','settled') then status
  else 'closed'
end;

update public.challenges set published_at = coalesce(published_at, created_at)
where status in ('published','closed','settled');

alter table public.challenges drop constraint if exists challenges_status_check;
alter table public.challenges
  add constraint challenges_status_check
    check (status in ('draft','published','closed','settled'));

alter table public.challenges alter column status set default 'draft';

create index if not exists challenges_status_deadline_idx
  on public.challenges (status, deadline desc);
create index if not exists challenges_shop_status_idx
  on public.challenges (shop_id, status);

-- ---------------------------------------------------------------------------
-- challenge_submissions -> uploaded entry
-- ---------------------------------------------------------------------------

alter table public.challenge_submissions
  add column if not exists asset_paths text[] not null default '{}',
  add column if not exists asset_meta jsonb not null default '[]',
  add column if not exists thumbnail_path text,
  add column if not exists submitted_at timestamptz,
  add column if not exists revision_count integer not null default 0,
  add column if not exists merchant_note text;

-- The original CHECK still restricts media_type to ('image','video'); only the NOT NULL
-- was ever dropped. That is why submit_creator_opportunity's media_type='external'
-- insert has always violated the constraint.
alter table public.challenge_submissions
  drop constraint if exists challenge_submissions_media_type_check;
alter table public.challenge_submissions
  add constraint challenge_submissions_media_type_check
    check (media_type is null or media_type in ('image','video'));

-- The optional social link stays; it is no longer TikTok-specific and no longer required.
alter table public.challenge_submissions
  alter column platform drop not null,
  alter column platform drop default;

update public.challenge_submissions set status = 'submitted' where status = 'pending';

alter table public.challenge_submissions drop constraint if exists challenge_submissions_status_check;
alter table public.challenge_submissions
  add constraint challenge_submissions_status_check
    check (status in ('draft','submitted','under_review','revision_requested','approved','rejected'));

alter table public.challenge_submissions alter column status set default 'draft';

-- final_rank doubles as the merchant-assigned winner rank; the settle path already
-- reads it, so reusing it avoids a parallel column.
alter table public.challenge_submissions drop constraint if exists challenge_submissions_final_rank_check;
alter table public.challenge_submissions
  add constraint challenge_submissions_final_rank_check
    check (final_rank is null or final_rank between 1 and 5);

create unique index if not exists challenge_submissions_rank_idx
  on public.challenge_submissions (challenge_id, final_rank)
  where final_rank is not null;

-- Open join means exactly one tracked entry row per creator per campaign.
create unique index if not exists challenge_submissions_one_entry_idx
  on public.challenge_submissions (challenge_id, user_id);

create index if not exists challenge_submissions_status_idx
  on public.challenge_submissions (challenge_id, status);

commit;
