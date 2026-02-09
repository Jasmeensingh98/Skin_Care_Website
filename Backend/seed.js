import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

dotenv.config();

const products = [
  // SERUMS - Premium Collection
  {
    name: "Niacinamide Power Serum",
    description: "10% Niacinamide serum to minimize pores and control sebum production. Perfect for oily and combination skin.",
    price: 1299,
    originalPrice: 1599,
    image: "/productsimages/Vulpine.png",
    category: "serums",
    skinType: ["oily", "combination"],
    rating: 4.8,
    reviews: 234,
    inStock: true
  },
  {
    name: "Vitamin C Brightening Serum",
    description: "20% stabilized Vitamin C serum for radiant glow and dark spot reduction. Lightweight and fast-absorbing.",
    price: 1799,
    originalPrice: 2199,
    image: "/productsimages/Vul.png",
    category: "serums",
    skinType: ["all"],
    rating: 4.9,
    reviews: 567,
    inStock: true
  },
  {
    name: "Retinol Advanced Serum",
    description: "Encapsulated retinol serum for anti-aging and skin renewal. Reduces fine lines and improves texture.",
    price: 1999,
    originalPrice: 2499,
    image: "/productsimages/Retinol.png",
    category: "serums",
    skinType: ["normal", "oily"],
    rating: 4.7,
    reviews: 445,
    inStock: true
  },
  {
    name: "Salicylic Acid Clarifying Serum",
    description: "2% Salicylic acid serum for acne-prone skin. Unclogs pores and prevents breakouts effectively.",
    price: 899,
    originalPrice: 1199,
    image: "/productsimages/Salicylic.png",
    category: "serums",
    skinType: ["oily", "combination"],
    rating: 4.6,
    reviews: 312,
    inStock: true
  },
  {
    name: "Hyaluronic Acid Hydrating Serum",
    description: "5-layer HA serum for deep hydration. Plumps skin and retains moisture all day long.",
    price: 1099,
    originalPrice: 1399,
    image: "https://source.unsplash.com/500x500/?hyaluronic,serum&sig=5",
    category: "serums",
    skinType: ["all"],
    rating: 4.8,
    reviews: 389,
    inStock: true
  },
  {
    name: "Peptide Firming Serum",
    description: "Multi-peptide serum for skin firmness and elasticity. Reduces sagging and improves skin structure.",
    price: 1599,
    originalPrice: 1999,
    image: "https://source.unsplash.com/500x500/?peptide,serum&sig=6",
    category: "serums",
    skinType: ["mature", "all"],
    rating: 4.7,
    reviews: 278,
    inStock: true
  },
  {
    name: "Alpha Hydroxy Acid Exfoliating Serum",
    description: "15% AHA serum for gentle chemical exfoliation. Brightens and smooths skin texture.",
    price: 1399,
    originalPrice: 1799,
    image: "https://source.unsplash.com/500x500/?aha,skincare&sig=7",
    category: "serums",
    skinType: ["normal", "combination"],
    rating: 4.6,
    reviews: 201,
    inStock: true
  },
  {
    name: "Azelaic Acid Blemish Serum",
    description: "10% Azelaic acid serum for rosacea and acne. Reduces redness and prevents bacterial growth.",
    price: 1199,
    originalPrice: 1499,
    image: "https://source.unsplash.com/500x500/?azelaic,serum&sig=8",
    category: "serums",
    skinType: ["sensitive", "combination"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },

  // MOISTURIZERS
  {
    name: "Lightweight Hydrating Moisturizer",
    description: "Oil-free moisturizer with ceramides for all skin types. Hydrates without clogging pores.",
    price: 799,
    originalPrice: 999,
    image: "https://source.unsplash.com/500x500/?moisturizer,skincare&sig=9",
    category: "moisturizer",
    skinType: ["all"],
    rating: 4.7,
    reviews: 423,
    inStock: true
  },
  {
    name: "Rich Night Repair Cream",
    description: "Luxurious night moisturizer with hyaluronic acid and peptides for overnight repair.",
    price: 1299,
    originalPrice: 1699,
    image: "https://source.unsplash.com/500x500/?night-cream,moisturizer&sig=10",
    category: "moisturizer",
    skinType: ["dry", "mature"],
    rating: 4.8,
    reviews: 334,
    inStock: true
  },
  {
    name: "Gel Moisturizer for Oily Skin",
    description: "Lightweight gel formula that hydrates without heaviness. Great for acne-prone skin.",
    price: 649,
    originalPrice: 899,
    image: "https://source.unsplash.com/500x500/?gel-moisturizer,skincare&sig=11",
    category: "moisturizer",
    skinType: ["oily"],
    rating: 4.5,
    reviews: 267,
    inStock: true
  },
  {
    name: "Sensitive Skin Soothing Moisturizer",
    description: "Hypoallergenic formula with aloe vera and centella asiatica for sensitive skin.",
    price: 899,
    originalPrice: 1199,
    image: "https://source.unsplash.com/500x500/?sensitive-skin,moisturizer&sig=12",
    category: "moisturizer",
    skinType: ["sensitive"],
    rating: 4.8,
    reviews: 289,
    inStock: true
  },

  // CLEANSERS
  {
    name: "Gentle Milk Cleanser",
    description: "Creamy cleanser that removes makeup and impurities without stripping skin.",
    price: 549,
    originalPrice: 699,
    image: "https://source.unsplash.com/500x500/?cleanser,skincare&sig=13",
    category: "cleanser",
    skinType: ["all"],
    rating: 4.6,
    reviews: 198,
    inStock: true
  },
  {
    name: "Charcoal Detox Cleanser",
    description: "Deep cleansing formula with activated charcoal. Removes dirt and oil buildup.",
    price: 649,
    originalPrice: 849,
    image: "https://source.unsplash.com/500x500/?charcoal,cleanser&sig=14",
    category: "cleanser",
    skinType: ["oily", "combination"],
    rating: 4.5,
    reviews: 234,
    inStock: true
  },
  {
    name: "Micellar Cleansing Water",
    description: "Instant makeup remover with micellar technology. No rinsing required.",
    price: 399,
    originalPrice: 549,
    image: "https://source.unsplash.com/500x500/?micellar,skincare&sig=15",
    category: "cleanser",
    skinType: ["all"],
    rating: 4.7,
    reviews: 567,
    inStock: true
  },
  {
    name: "Foam Cleansing Wash",
    description: "Foaming cleanser that removes excess oil while maintaining skin's natural balance.",
    price: 499,
    originalPrice: 699,
    image: "https://source.unsplash.com/500x500/?foaming-cleanser,skincare&sig=16",
    category: "cleanser",
    skinType: ["combination"],
    rating: 4.6,
    reviews: 145,
    inStock: true
  },
  {
    name: "Oil Cleansing Makeup Remover",
    description: "Nourishing oil cleanser that removes all makeup including waterproof products.",
    price: 749,
    originalPrice: 999,
    image: "https://source.unsplash.com/500x500/?oil-cleanser,skincare&sig=17",
    category: "cleanser",
    skinType: ["dry"],
    rating: 4.8,
    reviews: 312,
    inStock: true
  },

  // FACE MASKS
  {
    name: "Hydrating Sheet Mask (5 pack)",
    description: "Korean-style essence masks for instant hydration and glow. Single use.",
    price: 449,
    originalPrice: 599,
    image: "https://source.unsplash.com/500x500/?sheet-mask,skincare&sig=18",
    category: "masks",
    skinType: ["all"],
    rating: 4.7,
    reviews: 423,
    inStock: true
  },
  {
    name: "Clay Purifying Face Mask",
    description: "Detoxifying clay mask that deep cleans pores and removes impurities.",
    price: 699,
    originalPrice: 899,
    image: "https://source.unsplash.com/500x500/?clay-mask,skincare&sig=19",
    category: "masks",
    skinType: ["oily"],
    rating: 4.6,
    reviews: 267,
    inStock: true
  },
  {
    name: "Golden Glow Brightening Mask",
    description: "Luxurious mask with gold particles and Vitamin C for radiant skin.",
    price: 1099,
    originalPrice: 1399,
    image: "https://source.unsplash.com/500x500/?face-mask,skincare&sig=20",
    category: "masks",
    skinType: ["all"],
    rating: 4.8,
    reviews: 334,
    inStock: true
  },
  {
    name: "Anti-Aging Peptide Mask",
    description: "Premium mask with peptides and retinol for firming and anti-aging benefits.",
    price: 1299,
    originalPrice: 1699,
    image: "https://source.unsplash.com/500x500/?anti-aging,mask&sig=21",
    category: "masks",
    skinType: ["mature"],
    rating: 4.7,
    reviews: 198,
    inStock: true
  },
  {
    name: "Soothing Calming Mask",
    description: "Green tea and centella asiatica mask to calm irritated and inflamed skin.",
    price: 849,
    originalPrice: 1099,
    image: "https://source.unsplash.com/500x500/?soothing-mask,skincare&sig=22",
    category: "masks",
    skinType: ["sensitive"],
    rating: 4.8,
    reviews: 289,
    inStock: true
  },

  // SUNSCREEN
  {
    name: "SPF 50+ Lightweight Sunscreen",
    description: "Non-greasy sunscreen with mineral protection. Perfect for daily use.",
    price: 649,
    originalPrice: 849,
    image: "https://source.unsplash.com/500x500/?sunscreen,skincare&sig=23",
    category: "sun-care",
    skinType: ["all"],
    rating: 4.7,
    reviews: 423,
    inStock: true
  },
  {
    name: "SPF 70+ Water-Resistant Sunscreen",
    description: "Reef-safe sunscreen that's water-resistant for up to 80 minutes.",
    price: 749,
    originalPrice: 999,
    image: "https://source.unsplash.com/500x500/?sun-care,skincare&sig=24",
    category: "sun-care",
    skinType: ["oily"],
    rating: 4.6,
    reviews: 267,
    inStock: true
  },
  {
    name: "Tinted Sunscreen SPF 50",
    description: "Lightweight tinted sunscreen that evens out skin tone while providing UV protection.",
    price: 899,
    originalPrice: 1199,
    image: "https://source.unsplash.com/500x500/?tinted-sunscreen,skincare&sig=25",
    category: "sun-care",
    skinType: ["all"],
    rating: 4.8,
    reviews: 334,
    inStock: true
  },
  {
    name: "Facial Sunscreen Stick SPF 60",
    description: "Convenient stick form sunscreen for face and sensitive areas. No white cast.",
    price: 549,
    originalPrice: 699,
    image: "https://source.unsplash.com/500x500/?sunscreen-stick,skincare&sig=26",
    category: "sun-care",
    skinType: ["all"],
    rating: 4.5,
    reviews: 198,
    inStock: true
  },

  // MAKEUP
  {
    name: "Luminous Foundation SPF 20",
    description: "Buildable coverage foundation with sun protection and dewy finish.",
    price: 999,
    originalPrice: 1299,
    image: "https://source.unsplash.com/500x500/?foundation,makeup&sig=27",
    category: "makeup",
    skinType: ["all"],
    rating: 4.7,
    reviews: 456,
    inStock: true
  },
  {
    name: "Long-Wear Liquid Lipstick",
    description: "24-hour wear liquid lipstick in 20+ shades. Transfer and water-resistant.",
    price: 449,
    originalPrice: 599,
    image: "https://source.unsplash.com/500x500/?lipstick,makeup&sig=28",
    category: "makeup",
    skinType: ["all"],
    rating: 4.8,
    reviews: 523,
    inStock: true
  },
  {
    name: "Hydrating Cream Blush",
    description: "Lightweight cream blush that blends seamlessly for natural flush.",
    price: 649,
    originalPrice: 899,
    image: "https://source.unsplash.com/500x500/?blush,makeup&sig=29",
    category: "makeup",
    skinType: ["all"],
    rating: 4.6,
    reviews: 267,
    inStock: true
  },
  {
    name: "Volumizing Mascara",
    description: "Waterproof mascara for maximum volume and length. All-day wear.",
    price: 499,
    originalPrice: 699,
    image: "https://source.unsplash.com/500x500/?mascara,makeup&sig=30",
    category: "makeup",
    skinType: ["all"],
    rating: 4.7,
    reviews: 389,
    inStock: true
  },
  {
    name: "Professional Eye Shadow Palette",
    description: "20-shade eyeshadow palette with matte and shimmer finishes.",
    price: 1199,
    originalPrice: 1599,
    image: "https://source.unsplash.com/500x500/?eyeshadow,makeup&sig=31",
    category: "makeup",
    skinType: ["all"],
    rating: 4.8,
    reviews: 534,
    inStock: true
  },
  {
    name: "Precision Eyebrow Pencil",
    description: "Ultra-fine tip eyebrow pencil for precise definition and natural look.",
    price: 349,
    originalPrice: 499,
    image: "https://source.unsplash.com/500x500/?eyebrow,makeup&sig=32",
    category: "makeup",
    skinType: ["all"],
    rating: 4.6,
    reviews: 201,
    inStock: true
  },
  {
    name: "Highlighting Powder Stick",
    description: "Portable highlighter stick for on-the-go touch-ups. 3 shade options.",
    price: 549,
    originalPrice: 749,
    image: "https://source.unsplash.com/500x500/?highlighter,makeup&sig=33",
    category: "makeup",
    skinType: ["all"],
    rating: 4.7,
    reviews: 278,
    inStock: true
  },

  // SPECIALIZED TREATMENTS
  {
    name: "Eye Contour Lifting Cream",
    description: "Delicate eye cream to reduce puffiness and fine lines around the eyes.",
    price: 1099,
    originalPrice: 1399,
    image: "https://source.unsplash.com/500x500/?eye-cream,skincare&sig=34",
    category: "skincare",
    skinType: ["all"],
    rating: 4.8,
    reviews: 312,
    inStock: true
  },
  {
    name: "Lip Plumping Serum",
    description: "Hydrating lip serum with peptides for fuller, softer lips.",
    price: 549,
    originalPrice: 749,
    image: "https://source.unsplash.com/500x500/?lip-serum,skincare&sig=35",
    category: "skincare",
    skinType: ["all"],
    rating: 4.6,
    reviews: 189,
    inStock: true
  },
  {
    name: "Neck & Décolletage Cream",
    description: "Specialized cream for delicate neck and chest area. Anti-aging formula.",
    price: 899,
    originalPrice: 1199,
    image: "https://source.unsplash.com/500x500/?neck-cream,skincare&sig=36",
    category: "skincare",
    skinType: ["mature"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    name: "Overnight Repair Barrier Serum",
    description: "Lightweight serum to strengthen skin barrier overnight.",
    price: 1299,
    originalPrice: 1699,
    image: "https://source.unsplash.com/500x500/?barrier-serum,skincare&sig=37",
    category: "serums",
    skinType: ["sensitive"],
    rating: 4.8,
    reviews: 234,
    inStock: true
  },
  {
    name: "Pore Minimizing Essence",
    description: "Lightweight essence that minimizes pore appearance and preps skin.",
    price: 699,
    originalPrice: 899,
    image: "https://source.unsplash.com/500x500/?essence,skincare&sig=38",
    category: "skincare",
    skinType: ["oily", "combination"],
    rating: 4.6,
    reviews: 201,
    inStock: true
  },
  {
    name: "Hydrating Facial Mist",
    description: "Refreshing mist with rose water and hyaluronic acid for on-the-go hydration.",
    price: 449,
    originalPrice: 599,
    image: "https://source.unsplash.com/500x500/?facial-mist,skincare&sig=39",
    category: "skincare",
    skinType: ["all"],
    rating: 4.7,
    reviews: 267,
    inStock: true
  },
  {
    name: "Exfoliating Body Polish",
    description: "Gentle body exfoliant with sugar crystals and oils for smooth skin.",
    price: 549,
    originalPrice: 749,
    image: "https://source.unsplash.com/500x500/?body-scrub,skincare&sig=40",
    category: "skincare",
    skinType: ["all"],
    rating: 4.5,
    reviews: 145,
    inStock: true
  },
  {
    name: "Foot Repair Cream",
    description: "Rich foot cream with urea and shea butter for healing cracked heels.",
    price: 649,
    originalPrice: 849,
    image: "https://source.unsplash.com/500x500/?foot-cream,skincare&sig=41",
    category: "skincare",
    skinType: ["all"],
    rating: 4.6,
    reviews: 189,
    inStock: true
  },
  {
    name: "Hand Care Protection Serum",
    description: "Lightweight serum to protect and moisturize hands throughout the day.",
    price: 399,
    originalPrice: 549,
    image: "https://source.unsplash.com/500x500/?hand-cream,skincare&sig=42",
    category: "skincare",
    skinType: ["all"],
    rating: 4.7,
    reviews: 223,
    inStock: true
  },
  {
    name: "Scalp Treatment Serum",
    description: "Nourishing serum for scalp health and hair growth stimulation.",
    price: 799,
    originalPrice: 999,
    image: "https://source.unsplash.com/500x500/?scalp-serum,skincare&sig=43",
    category: "skincare",
    skinType: ["all"],
    rating: 4.6,
    reviews: 167,
    inStock: true
  },
  {
    name: "Probiotic Skin Balancing Serum",
    description: "Fermented ingredients serum to balance skin microbiome.",
    price: 1399,
    originalPrice: 1799,
    image: "https://source.unsplash.com/500x500/?probiotic-serum,skincare&sig=44",
    category: "serums",
    skinType: ["sensitive"],
    rating: 4.8,
    reviews: 278,
    inStock: true
  },
  {
    name: "Caffeine Energy Boost Serum",
    description: "Energizing serum with caffeine to reduce puffiness and fatigue.",
    price: 999,
    originalPrice: 1299,
    image: "https://source.unsplash.com/500x500/?caffeine-serum,skincare&sig=45",
    category: "serums",
    skinType: ["all"],
    rating: 4.7,
    reviews: 245,
    inStock: true
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.DB || 'mongodb://localhost:27017/vulpine';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const normalizedProducts = products.map((product) => ({
      title: product.name,
      desc: product.description,
      img: product.image,
      discountedPrice: product.price,
      originalNumber: product.originalPrice,
      categories: product.category ? [product.category] : [],
      skintype: Array.isArray(product.skinType) ? product.skinType : [],
      inStock: product.inStock ?? true,
    }));

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(normalizedProducts);
    console.log(`✅ Successfully added ${result.length} products to the database!`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
