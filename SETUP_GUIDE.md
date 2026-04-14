# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Installation (5 minutes)

```bash
# Install all dependencies
npm install
```

### 2. Verify Environment Variables

Check that your `.env` file exists with these variables:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Verification

The database is already set up with:
- ✅ Tables created (`menu_items`, `orders`)
- ✅ Sample data inserted (20 menu items)
- ✅ Row Level Security enabled
- ✅ Real-time subscriptions configured

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Testing the System

### Test Customer Flow

1. Open: `http://localhost:5173/?table=5`
2. Browse menu items
3. Add items to cart
4. Click cart icon
5. Place order
6. View confirmation bill

### Test Admin Dashboard

1. Open: `http://localhost:5173/?admin=true`
2. View statistics (should show 0 if no orders yet)
3. Keep this tab open
4. In another tab, place an order as customer
5. Watch order appear in real-time with notification!

### Test QR Code Generator

1. Open: `http://localhost:5173/?qr=true`
2. Set number of tables (e.g., 10)
3. Click "Download All"
4. QR codes will download automatically
5. Scan one with your phone to test

## URL Patterns

| URL | Purpose |
|-----|---------|
| `/?table=1` | Customer menu for table 1 |
| `/?admin=true` | Admin dashboard |
| `/?qr=true` | QR code generator |
| `/` | Landing page |

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check code quality
npm run typecheck       # Check TypeScript types
```

## Folder Structure Guide

```
src/
├── lib/
│   └── supabase.ts              # Database client
├── context/
│   └── CartContext.tsx          # Cart state management
├── pages/
│   ├── MenuPage.tsx             # Customer menu
│   ├── CartPage.tsx             # Shopping cart
│   ├── OrderConfirmationPage.tsx # Order success
│   ├── AdminDashboard.tsx       # Admin panel
│   └── QRCodeGenerator.tsx      # QR generator
└── App.tsx                      # Main app routing
```

## Features Checklist

After setup, you should be able to:

**Customer Features:**
- ✅ Scan QR code (or use `?table=X`)
- ✅ Browse menu by category
- ✅ Search menu items
- ✅ Add/remove items from cart
- ✅ Adjust item quantities
- ✅ Place orders
- ✅ View digital bill

**Admin Features:**
- ✅ View real-time dashboard
- ✅ See all orders
- ✅ Update order status
- ✅ View sales analytics
- ✅ Monitor popular items
- ✅ Receive order notifications

**System Features:**
- ✅ Generate QR codes
- ✅ Real-time updates
- ✅ Mobile responsive design
- ✅ Fast performance

## Common Issues & Solutions

### Issue: No menu items showing
**Solution:** Sample data should be inserted. If not, run:
```sql
-- Check if data exists
SELECT COUNT(*) FROM menu_items;

-- If 0, data wasn't inserted. Contact support.
```

### Issue: Real-time not working
**Solution:**
1. Check Supabase dashboard → Settings → API → Realtime is enabled
2. Refresh the page
3. Check browser console for errors

### Issue: Orders not saving
**Solution:**
1. Verify Supabase URL and keys in `.env`
2. Check RLS policies are created
3. Open browser console for error details

### Issue: QR codes downloading as blank
**Solution:**
1. Wait a moment for QR generation
2. Try downloading individual codes first
3. Check browser popup blocker settings

## Next Steps

1. **Customize Menu**
   - Add your restaurant's actual menu items
   - Upload your own images
   - Adjust prices

2. **Customize Branding**
   - Change colors in Tailwind classes
   - Update restaurant name
   - Add logo

3. **Deploy to Production**
   - Build project: `npm run build`
   - Deploy to Vercel/Netlify
   - Update environment variables
   - Generate production QR codes

4. **Print QR Codes**
   - Download all table QR codes
   - Print on quality paper/stickers
   - Place on each table

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Recharts:** https://recharts.org

## Production Checklist

Before going live:

- [ ] Update menu with real items
- [ ] Test all features thoroughly
- [ ] Deploy to production hosting
- [ ] Set production environment variables
- [ ] Generate QR codes with production URL
- [ ] Print and laminate QR codes
- [ ] Train staff on admin dashboard
- [ ] Test ordering process end-to-end
- [ ] Set up monitoring/analytics
- [ ] Prepare customer support process

---

**Ready to serve!** Your restaurant ordering system is set up and ready to use.
