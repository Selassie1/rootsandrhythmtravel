// /tmp/check_schema.ts
import { createClient } from '../src/utils/supabase/server';

async function checkSchema() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('tours').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching one tour:', error);
    return;
  }
  console.log('Columns in tours table:', Object.keys(data));
  console.log('Data sample:', data);
}

checkSchema().catch(console.error);
