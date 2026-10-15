// Optimized real event gallery photos (100% horizontal landscape orientation)
import ownerImg from '@/assets/websiteimage/optimized/Owner.jpg'
import img00045 from '@/assets/websiteimage/optimized/DSC00045.jpg'
import img00462 from '@/assets/websiteimage/optimized/DSC00462.jpg'
import img00603 from '@/assets/websiteimage/optimized/DSC00603.jpg'
import img00608 from '@/assets/websiteimage/optimized/DSC00608.jpg'
import img01376 from '@/assets/websiteimage/optimized/DSC01376.jpg'
import img08789 from '@/assets/websiteimage/optimized/DSC08789.jpg'
import img3155 from '@/assets/websiteimage/optimized/DSC_3155.jpg'
import img3165 from '@/assets/websiteimage/optimized/DSC_3165.jpg'
import img3168 from '@/assets/websiteimage/optimized/DSC_3168.jpg'
import imgC2897 from '@/assets/websiteimage/optimized/C2897T01.jpg'

// Dedicated verified horizontal event images
import butterflyDiningImg from '@/assets/images/butterfly-dining.jpg'
import italianCuisineImg from '@/assets/images/italian-cuisine-real.jpg'
import iceCreamImg from '@/assets/websiteimage/optimized/DSC09944_horizontal.jpg'
import fruitSkewersImg from '@/assets/websiteimage/optimized/DSC09955_horizontal.jpg'
import goldenDiningImg from '@/assets/images/gallery-6_horizontal.jpg'
import buffetImg from '@/assets/images/gallery-9_horizontal.jpg'
import teaShowImg from '@/assets/images/gallery-1_horizontal.jpg'

export const FOUNDER_DATA = {
  name: 'Kolathur Babu',
  role: 'Founder & Chief Caterer',
  image: ownerImg,
  tagline: 'Leading Chennai with 20+ Years of Authentic Taste & Royal Hospitality',
  experience: '20+ Years',
  events: '5,000+ Grand Celebrations',
  quote:
    'Every celebration is a family moment. We prepare every dish with pure devotion, premium ingredients, and warm hospitality so your guests remember the feast forever.',
}

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'counters', label: 'Buffets & Counters' },
  { id: 'live', label: 'Live Food Stalls' },
  { id: 'desserts', label: 'Fruits & Desserts' },
  { id: 'dining', label: 'Grand Banquets' },
]

export const ALL_GALLERY_IMAGES = [
  // 1. Fresh Fruits counter (Renamed from live dosa)
  {
    id: 'web-fruits',
    src: img3165,
    title: 'Exotic Fresh Fruits Counter',
    category: 'desserts',
    tag: 'Fresh Fruits counter',
  },
  // 2. live Pani puri (Renamed from live tiffin)
  {
    id: 'web-panipuri',
    src: img00608,
    title: 'Live Pani Puri Counter',
    category: 'live',
    tag: 'live Pani puri',
  },
  // 3. Butterfly Dinning Setup (Renamed from Fruit Carving)
  {
    id: 'web-butterfly',
    src: butterflyDiningImg,
    title: 'Butterfly Dinning Setup',
    category: 'dining',
    tag: 'Butterfly Dinning Setup',
  },
  // 4. italian cuisine (Renamed from Beverages)
  {
    id: 'web-italian',
    src: italianCuisineImg,
    title: 'Live Italian Cuisine & Pasta Counter',
    category: 'live',
    tag: 'italian cuisine',
  },
  // 5. Aaha Live Dosa Counter
  {
    id: 'web-dosa',
    src: img00462,
    title: 'Aaha Live Dosa & Chutney Counter',
    category: 'live',
    tag: 'Live Counter',
  },
  // 6. Sweet Temptation Live Dessert Counter
  {
    id: 'web-sweet-temptation',
    src: img3155,
    title: 'Sweet Temptation Live Dessert Counter',
    category: 'desserts',
    tag: 'Live Counter',
  },
  // 7. Traditional South Indian Banana Leaf Feast
  {
    id: 'web-banana-leaf',
    src: img00045,
    title: 'Traditional South Indian Banana Leaf Feast',
    category: 'dining',
    tag: 'Banana Leaf',
  },
  // 8. Royal South Indian Feast with Cone Ghee Dosa
  {
    id: 'web-cone-dosa',
    src: img01376,
    title: 'Grand Wedding Feast with Cone Ghee Dosa',
    category: 'dining',
    tag: 'Traditional Feast',
  },
  // 9. Royal Chettinad Non-Veg Feast Spread
  {
    id: 'web-chettinad',
    src: img08789,
    title: 'Royal Chettinad Non-Veg Feast Spread',
    category: 'dining',
    tag: 'Grand Reception',
  },
  // 10. Gourmet Chaat & Sev Puri Platter
  {
    id: 'web-chaat',
    src: img00603,
    title: 'Gourmet Chaat & Sev Puri Platter',
    category: 'live',
    tag: 'Live Cooking',
  },
  // 11. Illuminated Welcome Mocktail & Juice Bar
  {
    id: 'web-mocktails',
    src: img3168,
    title: 'Illuminated Welcome Mocktail & Juice Bar',
    category: 'counters',
    tag: 'Welcome Drinks',
  },
  // 12. Founder Kolathur Babu Serving Guests
  {
    id: 'web-babu-host',
    src: imgC2897,
    title: 'Founder Kolathur Babu Interacting with Guests',
    category: 'dining',
    tag: 'Expert Team',
  },
  // 14. Interactive Turkish Ice Cream Live Stall
  {
    id: 'web-ice-cream',
    src: iceCreamImg,
    title: 'Interactive Turkish Ice Cream Live Stall',
    category: 'desserts',
    tag: 'Ice Cream',
  },
  // 15. Artisan Fruit Display & Skewers
  {
    id: 'web-fruit-skewers',
    src: fruitSkewersImg,
    title: 'Artisan Fruit Display & Skewers',
    category: 'desserts',
    tag: 'Fresh Fruits',
  },
  // 16. Royal Golden Dining Thali Arrangement
  {
    id: 'web-golden-thali',
    src: goldenDiningImg,
    title: 'Royal Golden Dining Thali Arrangement',
    category: 'dining',
    tag: 'Banquet Hall',
  },
  // 17. Illuminated Grand Banquet Buffet Spread
  {
    id: 'web-buffet-spread',
    src: buffetImg,
    title: 'Illuminated Grand Banquet Buffet Spread',
    category: 'counters',
    tag: 'Buffet Spread',
  },
  // 18. Live Tandoori Chai & Hot Beverage Counter
  {
    id: 'web-chai',
    src: teaShowImg,
    title: 'Live Tandoori Chai & Hot Beverage Counter',
    category: 'live',
    tag: 'High Tea',
  },
]
