
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple .env parser
const parseEnv = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    console.log('Reading .env from:', envPath);
    if (!fs.existsSync(envPath)) {
      console.error('.env file not found at:', envPath);
      return {};
    }
    const envFile = fs.readFileSync(envPath, 'utf8');
    const env: Record<string, string> = {};
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });
    return env;
  } catch (e) {
    console.error('Error reading .env file:', e);
    return {};
  }
};

const main = async () => {
  const env = parseEnv();
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    console.log('Found keys:', Object.keys(env));
    process.exit(1);
  }

  console.log('Connecting to Supabase:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Checking "events" table...');
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .limit(1);

  if (eventsError) {
    console.log('Events table check failed:', eventsError.message);
  } else {
    console.log('Events table exists. Count:', events?.length ?? 0);
    if (events && events.length > 0) {
      console.log('Events table schema keys:', Object.keys(events[0]));
    }
  }

  console.log('Checking "challenges" table...');
  const { data: challenges, error: challengesError } = await supabase
    .from('challenges')
    .select('*')
    .limit(1);

  if (challengesError) {
    console.log('Challenges table check failed:', challengesError.message);
  } else {
    console.log('Challenges table exists. Count:', challenges?.length ?? 0);
  }
};

main();
