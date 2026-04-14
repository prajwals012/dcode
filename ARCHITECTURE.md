# System Architecture

## Overview

This is a full-stack QR-based restaurant ordering system built with React and Supabase. The system enables customers to scan QR codes at tables, browse menus, place orders, and receive instant confirmation. Restaurant staff can monitor and manage orders in real-time through an admin dashboard.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMER FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  QR Code Scan → Menu Page → Cart → Order Placement → Bill       │
│       ↓            ↓          ↓            ↓            ↓        │
│   Table #5    Browse Items  Review  Submit Order  Confirmation   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard → View Orders → Update Status → Monitor Analytics     │
│      ↓           ↓              ↓                 ↓              │
│  Real-time   Order List    Preparing/Served   Sales Stats        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  React App ←→ Supabase Client ←→ PostgreSQL Database            │
│      ↑              ↑                     ↑                      │
│  Cart State    Real-time API         Tables & RLS               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

### Backend Layer
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security
  - RESTful API (auto-generated)

### Libraries
- **@supabase/supabase-js** - Database client
- **lucide-react** - Icon components
- **recharts** - Data visualization
- **qrcode.react** - QR code generation

## Database Schema

### menu_items Table
Stores all available menu items.

```sql
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image text,
  description text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `idx_menu_items_category` - Fast category filtering

**RLS Policies:**
- Anyone can SELECT (public menu access)

### orders Table
Stores all customer orders.

```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number text NOT NULL,
  items jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending',
  customer_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `idx_orders_table_number` - Fast table lookup
- `idx_orders_status` - Fast status filtering
- `idx_orders_created_at` - Chronological sorting

**RLS Policies:**
- Anyone can INSERT (customer orders)
- Anyone can SELECT (order tracking)
- Anyone can UPDATE (status changes)

## Component Architecture

### State Management

#### Global State (Context API)
```typescript
CartContext
├── cart: CartItem[]
├── addToCart(item)
├── removeFromCart(itemId)
├── updateQuantity(itemId, quantity)
├── clearCart()
├── getCartTotal()
└── getCartItemsCount()
```

#### Local State (useState)
Each page manages its own:
- Loading states
- Form inputs
- UI toggles
- Error messages

### Component Hierarchy

```
App
├── Landing Page
├── Menu Page
│   └── Cart Context Consumer
├── Cart Page
│   └── Cart Context Consumer
├── Order Confirmation Page
├── Admin Dashboard
│   ├── Stats Cards
│   ├── Charts (Recharts)
│   └── Order Table
└── QR Generator
    └── QR Code Components
```

## Data Flow

### Order Placement Flow

1. **Customer adds items to cart**
   ```
   User clicks "Add" → addToCart() → Update CartContext
   ```

2. **Customer proceeds to checkout**
   ```
   Navigate to Cart Page → Display cart items → Calculate total
   ```

3. **Customer places order**
   ```
   Click "Place Order" →
   Supabase INSERT →
   orders table →
   Return order ID
   ```

4. **Real-time notification**
   ```
   Supabase Real-time →
   Admin Dashboard subscribes →
   New order event →
   Update UI + Sound notification
   ```

5. **Order confirmation**
   ```
   Navigate to Confirmation →
   Fetch order details →
   Display bill
   ```

### Real-time Subscription

```typescript
// Admin Dashboard subscribes to order changes
supabase
  .channel('orders_channel')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => {
      // New order received
      updateOrdersList(payload.new)
      showNotification()
      playSound()
    }
  )
  .subscribe()
```

## Routing System

Uses simple state-based routing:

```typescript
type Page = 'menu' | 'cart' | 'order-confirmation' | 'admin' | 'qr-generator' | 'landing'

// URL Parameters
?table=5          → Menu Page (table 5)
?admin=true       → Admin Dashboard
?qr=true          → QR Generator
/                 → Landing Page
```

## Security Model

### Row Level Security (RLS)

**menu_items:**
```sql
-- Public read access
CREATE POLICY "Anyone can view menu items"
  ON menu_items FOR SELECT
  USING (true);
```

**orders:**
```sql
-- Anyone can create orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anyone can view orders
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Anyone can update orders (for status changes)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true);
```

**Note:** In production, you should:
1. Restrict admin operations to authenticated users
2. Add authentication for staff
3. Limit customer access to their own orders

## Performance Optimizations

### Database
- Indexed columns for fast queries
- Efficient JSONB storage for order items
- Optimized RLS policies

### Frontend
- Code splitting (can be improved)
- Lazy loading images
- Memoized calculations
- Efficient re-renders with React hooks

### Real-time
- Single subscription per admin session
- Debounced notifications
- Selective data updates

## QR Code System

### QR Code Structure
```
URL Format: https://your-domain.com/?table={TABLE_NUMBER}

Example: https://restaurant.com/?table=5
         └─────┬─────┘  └─────┬─────┘
           Domain       Table Parameter
```

### QR Code Generation
```typescript
// Generate QR code
<QRCodeSVG
  value="https://your-domain.com/?table=5"
  size={400}
  level="H"  // High error correction
/>
```

### QR Code → Order Flow
```
1. Customer scans QR code
2. Browser opens URL with ?table=5
3. App reads URL parameter
4. Sets table number in state
5. Displays menu for that table
6. All orders tagged with table number
```

## API Endpoints (Auto-generated by Supabase)

### GET /rest/v1/menu_items
Fetch all menu items
```typescript
const { data } = await supabase
  .from('menu_items')
  .select('*')
  .eq('available', true)
```

### POST /rest/v1/orders
Create new order
```typescript
const { data } = await supabase
  .from('orders')
  .insert([orderData])
  .select()
```

### PATCH /rest/v1/orders
Update order status
```typescript
const { data } = await supabase
  .from('orders')
  .update({ status: 'preparing' })
  .eq('id', orderId)
```

### GET /rest/v1/orders
Fetch all orders
```typescript
const { data } = await supabase
  .from('orders')
  .select('*')
  .order('created_at', { ascending: false })
```

## Error Handling

### Frontend
- Try-catch blocks for all async operations
- User-friendly error messages
- Console logging for debugging
- Loading states during operations

### Database
- Check constraints on prices (>= 0)
- NOT NULL constraints on required fields
- Valid status enum values
- Foreign key relationships

## Scalability Considerations

### Current Scale
- Suitable for: 1-50 tables
- Orders: Thousands per day
- Menu items: Hundreds

### To Scale Further
1. **Add caching** (Redis)
2. **Optimize images** (CDN)
3. **Implement pagination** (orders list)
4. **Add database pooling**
5. **Use service workers** (PWA)
6. **Implement code splitting**

## Future Enhancements

### Recommended Additions
1. **Authentication**
   - Staff login for admin
   - Customer accounts

2. **Payment Integration**
   - Stripe/Razorpay
   - Split bills
   - Digital payments

3. **Advanced Features**
   - Order history
   - Table reservations
   - Loyalty programs
   - Push notifications

4. **Analytics**
   - Peak hours analysis
   - Popular item trends
   - Revenue forecasting
   - Customer insights

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│          Production Deployment                │
├──────────────────────────────────────────────┤
│                                               │
│  Frontend (Vercel/Netlify)                   │
│      ↓                                        │
│  Static Files + React App                    │
│      ↓                                        │
│  Supabase (Backend)                          │
│      ├─ PostgreSQL Database                  │
│      ├─ Real-time Server                     │
│      ├─ RESTful API                          │
│      └─ Storage (if needed)                  │
│                                               │
└──────────────────────────────────────────────┘
```

### Deployment Steps
1. Build React app → Static files
2. Deploy to hosting → Vercel/Netlify
3. Set environment variables
4. Database already on Supabase
5. Generate production QR codes

## Monitoring & Maintenance

### What to Monitor
- **Order success rate** (orders placed vs failed)
- **Page load times**
- **Real-time latency**
- **Database query performance**
- **Error rates**

### Regular Maintenance
- Review and optimize slow queries
- Clean up old orders (archive)
- Update menu items
- Monitor disk usage
- Check for security updates

---

**This architecture provides a solid foundation for a restaurant ordering system while remaining simple enough for easy maintenance and future enhancements.**
