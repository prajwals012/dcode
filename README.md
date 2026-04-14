# QR-Based Restaurant Menu & Ordering System

A complete full-stack restaurant ordering system with QR code integration, real-time order tracking, and admin dashboard.

## Features

### Customer Features
- **QR Code Menu Access** - Scan table QR codes to instantly access the menu
- **Browse Menu** - View categorized menu items with images and descriptions
- **Smart Cart** - Add items, adjust quantities, and view total in real-time
- **Easy Ordering** - Place orders with automatic table number detection
- **Digital Bill** - Receive instant order confirmation with itemized bill

### Admin Features
- **Real-time Dashboard** - Monitor orders as they come in with live notifications
- **Order Management** - Track and update order status (pending → preparing → served)
- **Analytics** - View sales statistics, popular items, and revenue charts
- **QR Code Generator** - Generate and download QR codes for all tables

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Real-time subscriptions)
- **UI Components**: Lucide React (icons), Recharts (charts), qrcode.react (QR codes)
- **Build Tool**: Vite

## Project Structure

```
src/
├── lib/
│   └── supabase.ts           # Supabase client & TypeScript interfaces
├── context/
│   └── CartContext.tsx       # Shopping cart state management
├── pages/
│   ├── MenuPage.tsx          # Customer menu browsing page
│   ├── CartPage.tsx          # Shopping cart & checkout
│   ├── OrderConfirmationPage.tsx  # Order success & bill
│   ├── AdminDashboard.tsx    # Admin panel with analytics
│   └── QRCodeGenerator.tsx   # QR code generation tool
├── App.tsx                   # Main app with routing logic
└── main.tsx                  # App entry point
```

## Database Schema

### menu_items
- `id` (uuid) - Unique item identifier
- `name` (text) - Dish name
- `price` (decimal) - Item price
- `category` (text) - Category (Beverages, Starters, Main Course, etc.)
- `image` (text) - Image URL
- `description` (text) - Item description
- `available` (boolean) - Stock availability

### orders
- `id` (uuid) - Unique order identifier
- `table_number` (text) - Table number from QR code
- `items` (jsonb) - Ordered items with quantities
- `total_amount` (decimal) - Order total
- `status` (text) - Order status (pending/preparing/served/cancelled)
- `customer_name` (text) - Optional customer name
- `created_at` (timestamptz) - Order timestamp
- `updated_at` (timestamptz) - Last update timestamp

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Supabase account (database is already configured)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The `.env` file should already contain your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Database Setup**
   The database tables and sample menu data are already created. If you need to reset:
   - Tables: `menu_items`, `orders`
   - 20 sample menu items across 5 categories

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Usage Guide

### For Customers

1. **Scan QR Code** - Use your phone camera to scan the table QR code
2. **Browse Menu** - View items by category or search for specific dishes
3. **Add to Cart** - Click "Add" on items you want to order
4. **Review Cart** - Click the cart icon to review your order
5. **Place Order** - Confirm your order and receive a digital bill
6. **Track Status** - Your order status updates in real-time

**Manual Access**: Visit `/?table=1` (replace 1 with table number)

### For Restaurant Staff

1. **Access Admin Dashboard**
   - Visit `/?admin=true`
   - Or click "Admin Dashboard" on the landing page

2. **Monitor Orders**
   - View all orders in real-time
   - Receive notifications for new orders
   - Update order status as you prepare/serve

3. **View Analytics**
   - Total orders and revenue
   - Popular menu items
   - Order status breakdown

### For Restaurant Owners

1. **Generate QR Codes**
   - Visit `/?qr=true`
   - Or click "Generate QR Codes" on the landing page

2. **Download QR Codes**
   - Set number of tables (1 to 100)
   - Download individual or all QR codes
   - Print and place on tables

3. **QR Code Format**
   - Each QR contains: `https://your-domain.com/?table=X`
   - Customers scan → automatically tagged with table number

## Key Features Explained

### Real-time Order Notifications
Uses Supabase Real-time subscriptions to instantly notify staff of new orders:
- Audio notification plays
- Visual alert displays
- Order appears immediately in dashboard

### Smart Cart Management
- Persistent cart state during session
- Auto-calculate totals with GST
- Easy quantity adjustment
- Remove items with one click

### QR Code System
- Unique QR per table
- Automatic table detection
- No app download required
- Works on any smartphone

### Order Status Workflow
```
New Order → Pending → Preparing → Served
                   ↘ Cancelled (if needed)
```

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access to menu (customers)
- Public write access to orders (customer orders)
- Admin operations open (can be restricted with auth)

## Sample Menu Categories

- **Beverages** - Chai, Coffee, Lassi, Fresh Juices
- **Starters** - Samosa, Paneer Tikka, Chicken Wings
- **Snacks** - Fries, Sandwiches, Burgers, Nachos
- **Main Course** - Butter Chicken, Biryani, Dal, Curries
- **Desserts** - Gulab Jamun, Ice Cream, Brownies, Fruit Salad

## Deployment

### Deploy Frontend (Recommended: Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy `dist` folder** to your hosting platform

3. **Set Environment Variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Update QR Codes
After deployment, generate new QR codes with your production URL:
1. Visit `https://your-domain.com/?qr=true`
2. Download all QR codes
3. Print and replace old QR codes

## Customization

### Add New Menu Items
```typescript
// Add directly through Supabase dashboard or via SQL:
INSERT INTO menu_items (name, price, category, image, description)
VALUES ('New Dish', 199.00, 'Main Course', 'image-url', 'Description');
```

### Modify Categories
Update the `categories` array in `MenuPage.tsx`:
```typescript
const categories = ['All', 'Beverages', 'Starters', 'Your Category'];
```

### Customize Colors
The app uses Tailwind CSS. Main colors:
- Primary: Orange (`orange-500`)
- Success: Green (`green-500`)
- Warning: Yellow (`yellow-500`)

Update in respective component files.

## Troubleshooting

**Orders not appearing in real-time?**
- Check Supabase Real-time is enabled in your project
- Verify database triggers are working
- Check browser console for errors

**QR codes not working?**
- Ensure URLs match your deployment domain
- Regenerate QR codes after deployment
- Check table parameter is being passed correctly

**Images not loading?**
- Verify image URLs are accessible
- Use stock photo services (Pexels recommended)
- Check CORS settings if using custom image server

## Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Customer authentication for order history
- [ ] Multi-language support
- [ ] Kitchen display system
- [ ] SMS/Email notifications
- [ ] Loyalty program
- [ ] Table reservation system
- [ ] Staff authentication for admin panel

## License

This project is open source and available for use in your restaurant.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check browser console for errors

---

**Built with ❤️ for restaurants everywhere**
