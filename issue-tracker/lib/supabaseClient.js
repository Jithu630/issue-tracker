import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://noxjxhfzjldjtmsflahj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veGp4aGZ6amxkanRtc2ZsYWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjY0NjAsImV4cCI6MjA2NDcwMjQ2MH0.xxYz49StZbHs_4eM91l2Tf9yhQm-bE2IXYRXB3mLuVo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);