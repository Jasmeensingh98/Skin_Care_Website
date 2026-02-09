import axios from 'axios';

const API_URL = 'http://localhost:5000/api/product';

const products = [
  // SERUMS
  { name: "Niacinamide Power Serum", description: "10% Niacinamide serum to minimize pores", price: 1299, originalPrice: 1599, image: "https://images.unsplash.com/photo-1608248543803-ba4f8a70ae0b?w=500", category: "serums", skinType: ["oily", "combination"], rating: 4.8, reviews: 234, inStock: true },
  { name: "Vitamin C Brightening Serum", description: "20% stabilized Vitamin C serum for radiant glow", price: 1799, originalPrice: 2199, image: "https://images.unsplash.com/photo-1583382178015-e83efdc61b4d?w=500", category: "serums", skinType: ["all"], rating: 4.9, reviews: 567, inStock: true },
  { name: "Retinol Advanced Serum", description: "Encapsulated retinol serum for anti-aging", price: 1999, originalPrice: 2499, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500", category: "serums", skinType: ["normal", "oily"], rating: 4.7, reviews: 445, inStock: true },
  { name: "Salicylic Acid Clarifying Serum", description: "2% Salicylic acid serum for acne-prone skin", price: 899, originalPrice: 1199, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "serums", skinType: ["oily"], rating: 4.6, reviews: 312, inStock: true },
  { name: "Hyaluronic Acid Hydrating Serum", description: "5-layer HA serum for deep hydration", price: 1099, originalPrice: 1399, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500", category: "serums", skinType: ["all"], rating: 4.8, reviews: 389, inStock: true },
  { name: "Peptide Firming Serum", description: "Multi-peptide serum for skin firmness", price: 1599, originalPrice: 1999, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "serums", skinType: ["mature"], rating: 4.7, reviews: 278, inStock: true },
  { name: "AHA Exfoliating Serum", description: "15% AHA serum for chemical exfoliation", price: 1399, originalPrice: 1799, image: "https://images.unsplash.com/photo-1630065633529-c6b9a2e2a3d0?w=500", category: "serums", skinType: ["normal"], rating: 4.6, reviews: 201, inStock: true },
  { name: "Azelaic Acid Blemish Serum", description: "10% Azelaic acid for rosacea and acne", price: 1199, originalPrice: 1499, image: "https://images.unsplash.com/photo-1612817288484-4472c6b0f0e1?w=500", category: "serums", skinType: ["sensitive"], rating: 4.7, reviews: 156, inStock: true },
  
  // MOISTURIZERS
  { name: "Lightweight Hydrating Moisturizer", description: "Oil-free moisturizer with ceramides", price: 799, originalPrice: 999, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500", category: "moisturizer", skinType: ["all"], rating: 4.7, reviews: 423, inStock: true },
  { name: "Rich Night Repair Cream", description: "Luxurious night moisturizer with peptides", price: 1299, originalPrice: 1699, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "moisturizer", skinType: ["dry"], rating: 4.8, reviews: 334, inStock: true },
  { name: "Gel Moisturizer for Oily Skin", description: "Lightweight gel formula", price: 649, originalPrice: 899, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "moisturizer", skinType: ["oily"], rating: 4.5, reviews: 267, inStock: true },
  { name: "Sensitive Skin Soothing Moisturizer", description: "Hypoallergenic with aloe vera", price: 899, originalPrice: 1199, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "moisturizer", skinType: ["sensitive"], rating: 4.8, reviews: 289, inStock: true },
  
  // CLEANSERS
  { name: "Gentle Milk Cleanser", description: "Creamy cleanser for all skin types", price: 549, originalPrice: 699, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500", category: "cleanser", skinType: ["all"], rating: 4.6, reviews: 198, inStock: true },
  { name: "Charcoal Detox Cleanser", description: "Deep cleansing with activated charcoal", price: 649, originalPrice: 849, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "cleanser", skinType: ["oily"], rating: 4.5, reviews: 234, inStock: true },
  { name: "Micellar Cleansing Water", description: "Instant makeup remover", price: 399, originalPrice: 549, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "cleanser", skinType: ["all"], rating: 4.7, reviews: 567, inStock: true },
  { name: "Foam Cleansing Wash", description: "Foaming cleanser for balance", price: 499, originalPrice: 699, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "cleanser", skinType: ["combination"], rating: 4.6, reviews: 145, inStock: true },
  { name: "Oil Cleansing Makeup Remover", description: "Nourishing oil cleanser", price: 749, originalPrice: 999, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500", category: "cleanser", skinType: ["dry"], rating: 4.8, reviews: 312, inStock: true },
  
  // MASKS
  { name: "Hydrating Sheet Mask (5 pack)", description: "Korean-style essence masks", price: 449, originalPrice: 599, image: "https://images.unsplash.com/photo-1612817288484-4472c6b0f0e1?w=500", category: "masks", skinType: ["all"], rating: 4.7, reviews: 423, inStock: true },
  { name: "Clay Purifying Face Mask", description: "Detoxifying clay mask", price: 699, originalPrice: 899, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "masks", skinType: ["oily"], rating: 4.6, reviews: 267, inStock: true },
  { name: "Golden Glow Brightening Mask", description: "Luxury mask with gold particles", price: 1099, originalPrice: 1399, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "masks", skinType: ["all"], rating: 4.8, reviews: 334, inStock: true },
  { name: "Anti-Aging Peptide Mask", description: "Premium mask with peptides", price: 1299, originalPrice: 1699, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "masks", skinType: ["mature"], rating: 4.7, reviews: 198, inStock: true },
  { name: "Soothing Calming Mask", description: "Green tea and centella asiatica mask", price: 849, originalPrice: 1099, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "masks", skinType: ["sensitive"], rating: 4.8, reviews: 289, inStock: true },
  
  // SUNSCREEN
  { name: "SPF 50+ Lightweight Sunscreen", description: "Non-greasy with mineral protection", price: 649, originalPrice: 849, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "sun-care", skinType: ["all"], rating: 4.7, reviews: 423, inStock: true },
  { name: "SPF 70+ Water-Resistant Sunscreen", description: "Reef-safe sunscreen", price: 749, originalPrice: 999, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "sun-care", skinType: ["oily"], rating: 4.6, reviews: 267, inStock: true },
  { name: "Tinted Sunscreen SPF 50", description: "Lightweight tinted formula", price: 899, originalPrice: 1199, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "sun-care", skinType: ["all"], rating: 4.8, reviews: 334, inStock: true },
  { name: "Facial Sunscreen Stick SPF 60", description: "Convenient stick form", price: 549, originalPrice: 699, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "sun-care", skinType: ["all"], rating: 4.5, reviews: 198, inStock: true },
  
  // MAKEUP
  { name: "Luminous Foundation SPF 20", description: "Buildable coverage foundation", price: 999, originalPrice: 1299, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "makeup", skinType: ["all"], rating: 4.7, reviews: 456, inStock: true },
  { name: "Long-Wear Liquid Lipstick", description: "24-hour wear in 20+ shades", price: 449, originalPrice: 599, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "makeup", skinType: ["all"], rating: 4.8, reviews: 523, inStock: true },
  { name: "Hydrating Cream Blush", description: "Lightweight cream blush", price: 649, originalPrice: 899, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "makeup", skinType: ["all"], rating: 4.6, reviews: 267, inStock: true },
  { name: "Volumizing Mascara", description: "Waterproof for max volume", price: 499, originalPrice: 699, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "makeup", skinType: ["all"], rating: 4.7, reviews: 389, inStock: true },
  { name: "Professional Eye Shadow Palette", description: "20-shade palette", price: 1199, originalPrice: 1599, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "makeup", skinType: ["all"], rating: 4.8, reviews: 534, inStock: true },
  { name: "Precision Eyebrow Pencil", description: "Ultra-fine tip for definition", price: 349, originalPrice: 499, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "makeup", skinType: ["all"], rating: 4.6, reviews: 201, inStock: true },
  { name: "Highlighting Powder Stick", description: "Portable highlighter stick", price: 549, originalPrice: 749, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "makeup", skinType: ["all"], rating: 4.7, reviews: 278, inStock: true },
  
  // SPECIALIZED
  { name: "Eye Contour Lifting Cream", description: "Reduces puffiness and fine lines", price: 1099, originalPrice: 1399, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "skincare", skinType: ["all"], rating: 4.8, reviews: 312, inStock: true },
  { name: "Lip Plumping Serum", description: "Hydrating with peptides", price: 549, originalPrice: 749, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "skincare", skinType: ["all"], rating: 4.6, reviews: 189, inStock: true },
  { name: "Neck & Décolletage Cream", description: "Specialized anti-aging formula", price: 899, originalPrice: 1199, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "skincare", skinType: ["mature"], rating: 4.7, reviews: 156, inStock: true },
  { name: "Pore Minimizing Essence", description: "Lightweight essence", price: 699, originalPrice: 899, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "skincare", skinType: ["oily"], rating: 4.6, reviews: 201, inStock: true },
  { name: "Hydrating Facial Mist", description: "Rose water and hyaluronic acid", price: 449, originalPrice: 599, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "skincare", skinType: ["all"], rating: 4.7, reviews: 267, inStock: true },
  { name: "Exfoliating Body Polish", description: "Gentle sugar crystals formula", price: 549, originalPrice: 749, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "skincare", skinType: ["all"], rating: 4.5, reviews: 145, inStock: true },
  { name: "Foot Repair Cream", description: "Rich cream for cracked heels", price: 649, originalPrice: 849, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "skincare", skinType: ["all"], rating: 4.6, reviews: 189, inStock: true },
  { name: "Hand Care Protection Serum", description: "Lightweight daily protection", price: 399, originalPrice: 549, image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500", category: "skincare", skinType: ["all"], rating: 4.7, reviews: 223, inStock: true },
  { name: "Scalp Treatment Serum", description: "For scalp health and growth", price: 799, originalPrice: 999, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500", category: "skincare", skinType: ["all"], rating: 4.6, reviews: 167, inStock: true },
  { name: "Probiotic Skin Balancing Serum", description: "Fermented ingredients formula", price: 1399, originalPrice: 1799, image: "https://images.unsplash.com/photo-1599501860787-10ae9d259e46?w=500", category: "serums", skinType: ["sensitive"], rating: 4.8, reviews: 278, inStock: true },
  { name: "Caffeine Energy Boost Serum", description: "Reduces puffiness and fatigue", price: 999, originalPrice: 1299, image: "https://images.unsplash.com/photo-1608048550775-b5aaf00873d6?w=500", category: "serums", skinType: ["all"], rating: 4.7, reviews: 245, inStock: true }
];

async function seedFast() {
  console.log(`🚀 Adding ${products.length} products...\n`);
  let added = 0;
  
  for (const product of products) {
    try {
      await axios.post(API_URL, product, { timeout: 5000 });
      added++;
      console.log(`✅ (${added}/${products.length}) ${product.name}`);
    } catch (e) {
      console.log(`⏳ Retrying: ${product.name}`);
    }
  }
  
  console.log(`\n✨ Successfully added ${added} products!`);
}

seedFast();
