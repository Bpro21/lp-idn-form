import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuxmmxoykxnstzfncfbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG1teG95a3huc3R6Zm5jZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0Njg2ODAsImV4cCI6MjA5NDA0NDY4MH0.5khkUGqzbHkxPoTStzngcNtCVLlHIfAvCPONVT2F_Eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Settings in DB:');
  data.forEach(s => {
    console.log(`${s.key}: ${s.value}`);
  });
}

checkSettings();
