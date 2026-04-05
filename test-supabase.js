import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  const [incomeRes, expenseRes] = await Promise.all([
    supabase.from('income').select('amount, person, date, note').order('date', { ascending: false }).limit(10),
    supabase.from('expense').select('amount, category, date, note').order('date', { ascending: false }).limit(10)
  ]);
  
  console.log("Income Result:", JSON.stringify(incomeRes, null, 2));
  console.log("Expense Result:", JSON.stringify(expenseRes, null, 2));
}

testFetch();
