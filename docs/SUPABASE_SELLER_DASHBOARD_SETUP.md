# Supabase Seller Dashboard Setup Guide

Yeh guide step-by-step batata hai ke seller dashboard ke backend ko chalane ke liye Supabase me kya karna hai.

---

## ✅ Step 1: Verify Schema Already Deployed

Tumne already `supabase/schema.sql` ko Supabase SQL Editor me paste kar diya hai. Ab verify karo:

1. Supabase Dashboard → **Table Editor** me jao
2. Ye tables dikhne chahiye:
   - ✅ `profiles`
   - ✅ `seller_profiles`
   - ✅ `prompts`
   - ✅ `prompt_versions`
   - ✅ `order_items`
   - ✅ `orders`
   - ✅ `prompt_reviews`
   - ✅ `notifications`

Agar koi table missing hai, to `supabase/schema.sql` ko dobara SQL Editor me run karo.

---

## 📊 Step 2: Seed Test Data (Optional but Recommended)

Backend test karne ke liye sample data chahiye. Supabase SQL Editor me ye queries run karo:

### 2.1: Create a Test Seller Profile

```sql
-- First, create a test user in auth.users (or use your existing Supabase user ID)
-- Note: Replace 'YOUR_USER_ID_HERE' with actual Supabase auth user ID from Authentication tab

-- Insert into profiles
INSERT INTO public.profiles (id, role, username, display_name, avatar_url, bio)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with real UUID from auth.users
  'seller',
  'test_seller',
  'Test Seller',
  'https://via.placeholder.com/150',
  'I create amazing AI prompts'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'seller',
  username = 'test_seller',
  display_name = 'Test Seller';

-- Insert into seller_profiles
INSERT INTO public.seller_profiles (
  seller_id,
  headline,
  verification_status,
  completion_percent,
  payout_email,
  fee_split
)
VALUES (
  'YOUR_USER_ID_HERE',  -- Same UUID
  'Top Prompt Engineer',
  'unverified',
  60,
  'seller@example.com',
  '{"platform_percent": 15, "seller_percent": 85}'::jsonb
)
ON CONFLICT (seller_id) DO NOTHING;
```

**How to get YOUR_USER_ID_HERE:**
1. Supabase Dashboard → **Authentication** → **Users**
2. Kisi bhi user ka **UUID** copy karo (ya naya user banao)
3. Upar wale queries me replace karo

### 2.2: Create Sample Prompts

```sql
-- Replace YOUR_USER_ID_HERE with actual seller ID
INSERT INTO public.prompts (
  seller_id,
  title,
  slug,
  summary,
  price_cents,
  status,
  visibility,
  qa_score,
  metrics
)
VALUES
  (
    'YOUR_USER_ID_HERE',
    'Advanced ChatGPT Prompt for Code Review',
    'advanced-chatgpt-code-review',
    'A comprehensive prompt that helps ChatGPT review code for bugs, security issues, and best practices.',
    2999,  -- $29.99
    'live',
    'public',
    4.8,
    '{"views": 150, "sales": 12, "conversionRate": 8.0}'::jsonb
  ),
  (
    'YOUR_USER_ID_HERE',
    'Midjourney Character Design Prompt',
    'midjourney-character-design',
    'Create stunning character designs with consistent style using this optimized Midjourney prompt.',
    1999,  -- $19.99
    'live',
    'public',
    4.5,
    '{"views": 89, "sales": 7, "conversionRate": 7.9}'::jsonb
  ),
  (
    'YOUR_USER_ID_HERE',
    'DALL-E Product Photography Prompt',
    'dalle-product-photography',
    'Generate professional product photos with perfect lighting and composition.',
    1499,  -- $14.99
    'draft',
    'public',
    NULL,
    '{}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;
```

### 2.3: Create Sample Orders (for earnings stats)

```sql
-- First create an order
INSERT INTO public.orders (
  buyer_id,  -- Use any UUID (can be same as seller for testing)
  subtotal_cents,
  fees_cents,
  total_cents,
  status
)
VALUES (
  'YOUR_USER_ID_HERE',  -- Buyer ID (can be different user)
  4498,  -- $44.98
  675,   -- 15% platform fee
  5173,  -- Total
  'paid'
)
RETURNING id;

-- Then create order_items (replace ORDER_ID with the ID returned above)
-- Get prompt IDs first:
-- SELECT id FROM public.prompts WHERE seller_id = 'YOUR_USER_ID_HERE' LIMIT 2;

INSERT INTO public.order_items (
  order_id,
  prompt_id,
  seller_id,
  price_cents,
  platform_fee_cents,
  seller_earnings_cents
)
VALUES
  (
    'ORDER_ID_FROM_ABOVE',  -- Replace with actual order ID
    'PROMPT_ID_1',  -- Replace with first prompt ID from SELECT query
    'YOUR_USER_ID_HERE',
    2999,
    450,  -- 15% of 2999
    2549  -- 85% of 2999
  ),
  (
    'ORDER_ID_FROM_ABOVE',
    'PROMPT_ID_2',  -- Replace with second prompt ID
    'YOUR_USER_ID_HERE',
    1999,
    300,  -- 15% of 1999
    1699  -- 85% of 1999
  );
```

### 2.4: Create Sample Reviews

```sql
-- Get prompt IDs first (same as above)
INSERT INTO public.prompt_reviews (
  prompt_id,
  buyer_id,  -- Any UUID
  rating,
  headline,
  comment,
  status
)
VALUES
  (
    'PROMPT_ID_1',  -- Replace with actual prompt ID
    'BUYER_UUID',  -- Any UUID
    5,
    'Excellent prompt!',
    'This helped me review code much faster. Highly recommended!',
    'published'
  ),
  (
    'PROMPT_ID_2',
    'BUYER_UUID_2',
    4,
    'Good quality',
    'Works well for character design. Could use more examples.',
    'published'
  );
```

---

## 🧪 Step 3: Test Backend Endpoints

Backend server start karo:

```powershell
cd "C:\Users\HS Computers\Documents\pnx latest\PNX-main\backend"
npm run dev
```

Phir browser ya Postman me test karo:

### 3.1: Test Seller Dashboard
```
GET http://localhost:8080/api/sellers/YOUR_USER_ID_HERE/dashboard
```

Expected response:
```json
{
  "sellerId": "...",
  "profile": { ... },
  "kpis": [
    { "id": "revenue_30d", "label": "Net Earn (30D)", "value": "$42.48", ... },
    { "id": "catalog", "label": "Prompts", "value": "3", ... },
    ...
  ],
  "lifecycle": [ ... ],
  "payouts": { ... },
  ...
}
```

### 3.2: Test Seller Prompts
```
GET http://localhost:8080/api/sellers/YOUR_USER_ID_HERE/prompts?status=live
```

### 3.3: Test Seller Stats
```
GET http://localhost:8080/api/sellers/YOUR_USER_ID_HERE/stats?period=30d
```

---

## 🔧 Step 4: Frontend Integration

Frontend me seller dashboard component me ye endpoints call karo:

```typescript
// Example in seller dashboard component
const { currentUser } = useAuth()
const sellerId = currentUser?.uid

useEffect(() => {
  if (!sellerId) return
  
  // Fetch dashboard data
  fetch(`http://localhost:8080/api/sellers/${sellerId}/dashboard`)
    .then(res => res.json())
    .then(data => {
      setDashboardData(data)
    })
}, [sellerId])
```

---

## 📝 Important Notes

1. **RLS Policies**: Schema me already Row Level Security policies set hain. Agar koi data nahi dikh raha, to check karo ke:
   - User authenticated hai
   - `auth.uid()` matches `seller_id`

2. **Service Role Key**: Backend me `SUPABASE_SERVICE_ROLE_KEY` use ho raha hai, jo RLS bypass karta hai. Isliye backend se sab data access ho sakta hai.

3. **Data Types**: 
   - Prices `price_cents` me store hote hain (integer)
   - Frontend me divide by 100 karke dollars me show karo
   - Dates `timestamptz` format me hain

4. **Missing Data**: Agar koi endpoint empty array return kar raha hai, to check karo:
   - Supabase tables me data hai ya nahi
   - `seller_id` correct hai ya nahi
   - Backend logs me errors dikh rahe hain ya nahi

---

## 🚀 Next Steps

Jab test data seed ho jaye aur endpoints kaam karne lag jayen, to:

1. Frontend me seller dashboard UI ko backend data se connect karo
2. Real-time updates ke liye Supabase Realtime subscriptions add karo (optional)
3. Pagination add karo prompts listing me
4. Filters add karo (by status, date range, etc.)

---

## ❓ Troubleshooting

**Problem**: Endpoint 404 return kar raha hai
- **Solution**: Check karo ke backend server running hai (`npm run dev`)

**Problem**: Endpoint 503 return kar raha hai ("Supabase not configured")
- **Solution**: Check `backend/.env` me `SUPABASE_URL` aur `SUPABASE_SERVICE_ROLE_KEY` set hain

**Problem**: Empty data return ho raha hai
- **Solution**: 
  1. Supabase Table Editor me check karo ke data hai
  2. `seller_id` correct UUID hai
  3. Backend console me errors check karo

**Problem**: RLS policy error
- **Solution**: Backend service role key use kar raha hai, to RLS bypass hona chahiye. Agar phir bhi error aaye, to Supabase dashboard me policies check karo.

---

Yeh setup complete hone ke baad seller dashboard fully functional ho jayega! 🎉

