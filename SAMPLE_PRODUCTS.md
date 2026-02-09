# Sample Products for VULPINE Skincare

You can insert these products into your MongoDB database for testing.

## Using MongoDB Compass or mongo shell:

```javascript
// Switch to vulpine database
use vulpine

// Insert sample products
db.products.insertMany([
  {
    title: "Vitamin C Brightening Serum - 30ml",
    desc: "Premium 20% L-Ascorbic Acid serum for instant brightening and anti-oxidant protection. Reduces dark spots and improves skin texture.",
    img: "https://via.placeholder.com/400?text=Vitamin+C+Serum",
    video: "",
    whatinbox: "1x 30ml Bottle, 1x Dropper, User Guide",
    Brand: "VULPINE",
    originalNumber: 1499,
    discountedPrice: 999,
    categories: ["skincare", "serums"],
    skintype: ["all", "oily", "combination"],
    concern: ["dullness", "brightening", "dark spots"],
    inStock: true,
    ratings: []
  },
  {
    title: "Hyaluronic Acid Moisturizer - 50ml",
    desc: "Multi-molecular HA complex for deep hydration. Locks moisture for 24 hours. Perfect for dry and sensitive skin.",
    img: "https://via.placeholder.com/400?text=HA+Moisturizer",
    whatinbox: "1x 50ml Jar, Spatula, Instruction Card",
    Brand: "VULPINE",
    originalNumber: 999,
    discountedPrice: 649,
    categories: ["skincare", "moisturizer"],
    skintype: ["dry", "sensitive", "normal"],
    concern: ["dryness", "dehydration"],
    inStock: true,
    ratings: []
  },
  {
    title: "Niacinamide Pore Minimizing Mask - 100ml",
    desc: "5% Niacinamide clay mask that minimizes pores and controls sebum. Detoxifying formula with charcoal.",
    img: "https://via.placeholder.com/400?text=Niacinamide+Mask",
    whatinbox: "1x 100ml Tube, Brush, Care Guide",
    Brand: "VULPINE",
    originalNumber: 899,
    discountedPrice: 599,
    categories: ["skincare", "masks"],
    skintype: ["oily", "combination"],
    concern: ["acne", "pores", "sebum control"],
    inStock: true,
    ratings: []
  },
  {
    title: "Retinol Night Cream - 30ml",
    desc: "0.3% Retinol with peptides for anti-aging. Improves fine lines and boosts collagen production. Use at night.",
    img: "https://via.placeholder.com/400?text=Retinol+Night+Cream",
    whatinbox: "1x 30ml Jar, Spatula, Retinol Guide",
    Brand: "VULPINE",
    originalNumber: 1799,
    discountedPrice: 1199,
    categories: ["skincare", "anti-aging"],
    skintype: ["all"],
    concern: ["aging", "fine lines", "wrinkles"],
    inStock: true,
    ratings: []
  },
  {
    title: "Salicylic Acid Toner - 200ml",
    desc: "2% BHA toner for acne-prone skin. Exfoliates and unclogs pores. Reduces inflammation and breakouts.",
    img: "https://via.placeholder.com/400?text=BHA+Toner",
    whatinbox: "1x 200ml Bottle, Cotton Pads, User Manual",
    Brand: "VULPINE",
    originalNumber: 799,
    discountedPrice: 499,
    categories: ["skincare", "toner"],
    skintype: ["oily", "combination"],
    concern: ["acne", "blackheads"],
    inStock: true,
    ratings: []
  },
  {
    title: "SPF 50+ Sunscreen - 50ml",
    desc: "Broad spectrum mineral sunscreen with zinc oxide. Water-resistant, non-greasy formula. Perfect for daily use.",
    img: "https://via.placeholder.com/400?text=SPF50+Sunscreen",
    whatinbox: "1x 50ml Bottle, Application Guide",
    Brand: "VULPINE",
    originalNumber: 599,
    discountedPrice: 399,
    categories: ["skincare", "sun-care"],
    skintype: ["all"],
    concern: ["sun protection", "aging prevention"],
    inStock: true,
    ratings: []
  },
  {
    title: "Peptide Eye Cream - 15ml",
    desc: "Advanced peptide complex to reduce dark circles and puffiness. Strengthens delicate eye area.",
    img: "https://via.placeholder.com/400?text=Peptide+Eye+Cream",
    whatinbox: "1x 15ml Jar, Applicator, Instructions",
    Brand: "VULPINE",
    originalNumber: 1099,
    discountedPrice: 699,
    categories: ["skincare", "eye-care"],
    skintype: ["all"],
    concern: ["dark circles", "puffiness", "fine lines"],
    inStock: true,
    ratings: []
  },
  {
    title: "Rose Water Hydrating Mist - 120ml",
    desc: "Pure organic rose water with hyaluronic acid for instant hydration boost throughout the day.",
    img: "https://via.placeholder.com/400?text=Rose+Water+Mist",
    whatinbox: "1x 120ml Spray Bottle",
    Brand: "VULPINE",
    originalNumber: 499,
    discountedPrice: 299,
    categories: ["skincare", "mist"],
    skintype: ["all", "dry", "sensitive"],
    concern: ["dehydration"],
    inStock: true,
    ratings: []
  },
  {
    title: "Azelaic Acid Serum - 30ml",
    desc: "10% Azelaic Acid for rosacea and sensitive skin. Reduces redness and inflammation naturally.",
    img: "https://via.placeholder.com/400?text=Azelaic+Acid+Serum",
    whatinbox: "1x 30ml Bottle, Dropper, Care Card",
    Brand: "VULPINE",
    originalNumber: 1399,
    discountedPrice: 899,
    categories: ["skincare", "serums"],
    skintype: ["sensitive"],
    concern: ["rosacea", "redness", "sensitivity"],
    inStock: true,
    ratings: []
  },
  {
    title: "Charcoal Face Cleanser - 150ml",
    desc: "Activated charcoal cleanser that removes impurities without over-drying. Gentle yet effective.",
    img: "https://via.placeholder.com/400?text=Charcoal+Cleanser",
    whatinbox: "1x 150ml Tube",
    Brand: "VULPINE",
    originalNumber: 499,
    discountedPrice: 349,
    categories: ["skincare", "cleanser"],
    skintype: ["oily", "combination"],
    concern: ["dirt removal", "blackheads"],
    inStock: true,
    ratings: []
  },
  {
    title: "Collagen Boosting Sheet Mask - Pack of 5",
    desc: "Hydrating sheet masks infused with marine collagen. 20-minute intensive treatment.",
    img: "https://via.placeholder.com/400?text=Sheet+Masks",
    whatinbox: "5x Sheet Masks, Instruction Sheet",
    Brand: "VULPINE",
    originalNumber: 699,
    discountedPrice: 449,
    categories: ["skincare", "masks"],
    skintype: ["all"],
    concern: ["hydration", "collagen boost"],
    inStock: true,
    ratings: []
  },
  {
    title: "Makeup Setting Spray - 200ml",
    desc: "Long-lasting makeup setting spray that keeps makeup fresh all day. Lightweight formula.",
    img: "https://via.placeholder.com/400?text=Setting+Spray",
    whatinbox: "1x 200ml Spray Bottle",
    Brand: "VULPINE",
    originalNumber: 599,
    discountedPrice: 399,
    categories: ["makeup", "spray"],
    skintype: ["all"],
    concern: ["makeup longevity"],
    inStock: true,
    ratings: []
  },
  {
    title: "Liquid Foundation - 30ml",
    desc: "Flawless liquid foundation with SPF 20. Available in 12 shades. Full coverage, natural finish.",
    img: "https://via.placeholder.com/400?text=Liquid+Foundation",
    whatinbox: "1x 30ml Bottle, Shade Guide",
    Brand: "VULPINE",
    originalNumber: 799,
    discountedPrice: 549,
    categories: ["makeup", "foundation"],
    skintype: ["all"],
    concern: ["coverage", "sun protection"],
    inStock: true,
    ratings: []
  }
])
```

## Product Categories Reference

- **Skincare**: serums, moisturizer, masks, toner, eye-care, cleanser, mist, spray
- **Makeup**: foundation, setting spray
- **Sun Care**: sun-care

## Skin Types

- dry
- oily
- combination
- sensitive
- normal
- all

## Skin Concerns

- dullness
- brightening
- dark spots
- dryness
- dehydration
- acne
- pores
- sebum control
- aging
- fine lines
- wrinkles
- blackheads
- rosacea
- redness
- sensitivity
- sun protection
- aging prevention
- puffiness
- dirt removal
- hydration
- collagen boost
- makeup longevity
- coverage

## Inserting via API

You can also use Postman or curl to insert products:

```bash
curl -X POST http://localhost:5000/api/product \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product Name",
    "desc": "Description",
    "img": "image_url",
    "Brand": "VULPINE",
    "originalNumber": 1000,
    "discountedPrice": 700,
    "categories": ["skincare"],
    "skintype": ["all"],
    "concern": ["dullness"],
    "inStock": true
  }'
```

## Notes

- All prices are in INR (Indian Rupees)
- Discounted prices show savings
- All products are in stock by default
- Replace placeholder images with real images
- Add your own product descriptions for better SEO
