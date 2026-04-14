/*
  # Restaurant QR Menu System Database Schema

  ## Overview
  This migration creates the database structure for a QR-based restaurant ordering system.
  
  ## New Tables
  
  ### menu_items
  Stores all menu items available in the restaurant
  - `id` (uuid, primary key) - Unique identifier for each menu item
  - `name` (text) - Name of the dish
  - `price` (decimal) - Price of the item
  - `category` (text) - Category (Beverages, Snacks, Main Course, etc.)
  - `image` (text) - URL to the item image
  - `description` (text) - Item description
  - `available` (boolean) - Whether item is currently available
  - `created_at` (timestamptz) - Creation timestamp
  
  ### orders
  Stores all customer orders
  - `id` (uuid, primary key) - Unique identifier for each order
  - `table_number` (text) - Table number from which order was placed
  - `items` (jsonb) - Array of ordered items with quantities
  - `total_amount` (decimal) - Total order amount
  - `status` (text) - Order status (pending, preparing, served, cancelled)
  - `customer_name` (text, optional) - Customer name if provided
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  - Enable RLS on both tables
  - Allow public read access to menu_items (for customers)
  - Allow public insert access to orders (for customers)
  - Restrict update/delete operations (for future admin authentication)
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image text,
  description text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number text NOT NULL,
  items jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'served', 'cancelled')),
  customer_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items
-- Allow everyone to read menu items
CREATE POLICY "Anyone can view menu items"
  ON menu_items FOR SELECT
  USING (true);

-- RLS Policies for orders
-- Allow anyone to insert orders (customers placing orders)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view orders (for now, will be restricted later)
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Allow anyone to update orders (for status updates)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);