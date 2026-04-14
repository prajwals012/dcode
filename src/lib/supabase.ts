import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available: boolean;
  created_at: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id?: string;
  table_number: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  customer_name?: string;
  created_at?: string;
  updated_at?: string;
}
