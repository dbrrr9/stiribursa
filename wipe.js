import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  const { error: e1 } = await supabase.from('app_cache').select('id').limit(1);
  console.log("App_cache exists:", !e1);
  if (e1) console.error(e1);

  const { error: e2 } = await supabase.from('daily_briefs').select('id').limit(1);
  console.log("Daily_briefs exists:", !e2);
  if (e2) console.error(e2);
}

createTables();
