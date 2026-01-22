# Database Security Principles

> **RLS is NOT optional.** Every table must have a security policy.

## 🛡️ Row Level Security (RLS)

PostgreSQL RLS is the primary firewall for your data.

### 1. Enable RLS
Always enable RLS immediately after table creation.

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### 2. Define Policies
Explicitly define who can do what.

**Pattern: "Own Your Data"**
```sql
CREATE POLICY "Users can view own data" 
ON table_name 
FOR SELECT 
USING (auth.uid() = user_id);
```

**Pattern: "Public Read / Authorized Write"**
```sql
-- Everyone can read
CREATE POLICY "Public read access"
ON table_name FOR SELECT USING (true);

-- Only owners can update
CREATE POLICY "Owners can update"
ON table_name FOR UPDATE USING (auth.uid() = owner_id);
```

---

## 🔒 Best Practices

### Never use Service Keys in Client
The client (React Native app) should ONLY access the DB via the `anon` key, which is restricted by RLS.

### Least Privilege
- **SELECT**: Restrict via RLS policies.
- **INSERT**: Ensure `user_id` matches `auth.uid()` (often handled by default constraint `default auth.uid()` or trigger).
- **UPDATE/DELETE**: Strict RLS checks.

### Sensitive Data
Keep PII (Personally Identifiable Information) in a separate `profiles` or `private_user_data` table with stricter policies if necessary.
