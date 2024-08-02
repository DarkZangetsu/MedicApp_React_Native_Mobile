import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://xhcsgsahdddtqwuanxnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY3Nnc2FoZGRkdHF3dWFueG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MDA1MDEsImV4cCI6MjAzNzk3NjUwMX0.Zszey-Sq6seDnkQnZdK2ZxLPVwtmKzieUDARJLcHWAI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
});