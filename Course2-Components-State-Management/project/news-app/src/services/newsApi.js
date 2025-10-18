// News API service for fetching news data
// Note: This uses mock data since the News API requires an API key
// In a real application, you would replace this with actual API calls

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "React 18 Introduces New Concurrent Features",
    summary: "React 18 brings exciting new features including automatic batching, concurrent rendering, and new hooks that improve performance and user experience.",
    content: "React 18 represents a major milestone in the React ecosystem, introducing groundbreaking features that enhance both developer experience and application performance. The new concurrent features allow React to interrupt rendering work to handle higher priority updates, resulting in smoother user interactions.\n\nAutomatic batching is another significant improvement, automatically batching state updates across event handlers, timeouts, and promises. This reduces unnecessary re-renders and improves performance.\n\nThe new hooks like useId, useDeferredValue, and useTransition provide developers with more control over rendering behavior and enable better user experience patterns.",
    author: "Sarah Johnson",
    publishedAt: "2024-01-15T10:30:00Z",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    readTime: "5 min read",
    tags: ["React", "JavaScript", "Frontend", "Web Development"]
  },
  {
    id: 2,
    title: "Climate Change Summit Reaches Historic Agreement",
    summary: "World leaders have reached a historic agreement on climate change measures, committing to significant carbon reduction targets by 2030.",
    content: "In a landmark decision that will shape global environmental policy for decades to come, world leaders have reached a comprehensive agreement on climate change mitigation strategies. The agreement includes ambitious carbon reduction targets, renewable energy commitments, and international cooperation frameworks.\n\nThe summit, which brought together representatives from over 190 countries, focused on practical solutions to address the climate crisis. Key provisions include funding mechanisms for developing nations, technology transfer programs, and monitoring systems to ensure compliance.\n\nEnvironmental experts have praised the agreement as a crucial step forward, though they emphasize that implementation will be key to its success. The next phase involves detailed planning and resource allocation to meet the ambitious targets set forth in the agreement.",
    author: "Michael Chen",
    publishedAt: "2024-01-14T14:20:00Z",
    category: "politics",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de479e1a463c?w=800&h=400&fit=crop",
    readTime: "7 min read",
    tags: ["Climate", "Environment", "Politics", "Global"]
  },
  {
    id: 3,
    title: "New AI Breakthrough in Medical Diagnosis",
    summary: "Researchers have developed an AI system that can diagnose diseases with 95% accuracy, potentially revolutionizing healthcare delivery.",
    content: "A groundbreaking artificial intelligence system developed by researchers at leading medical institutions has achieved remarkable accuracy in disease diagnosis, potentially transforming how healthcare is delivered worldwide. The AI system, trained on millions of medical images and patient records, can identify various conditions with unprecedented precision.\n\nThe technology combines advanced machine learning algorithms with deep neural networks to analyze complex medical data. In clinical trials, the system demonstrated 95% accuracy across multiple disease categories, outperforming traditional diagnostic methods in many cases.\n\nHealthcare professionals are optimistic about the potential applications, from early disease detection to personalized treatment recommendations. However, they also emphasize the importance of maintaining human oversight and ensuring ethical implementation of the technology.",
    author: "Dr. Emily Rodriguez",
    publishedAt: "2024-01-13T09:15:00Z",
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    readTime: "6 min read",
    tags: ["AI", "Healthcare", "Technology", "Medicine"]
  },
  {
    id: 4,
    title: "SpaceX Launches Revolutionary Satellite Constellation",
    summary: "SpaceX has successfully launched the first batch of satellites for its new constellation, promising global internet coverage.",
    content: "SpaceX has achieved another milestone in space technology with the successful launch of its revolutionary satellite constellation. The mission deployed dozens of advanced satellites designed to provide high-speed internet coverage to underserved areas around the world.\n\nThe constellation represents a significant advancement in satellite technology, featuring improved solar panels, more efficient propulsion systems, and enhanced communication capabilities. Each satellite is equipped with advanced antennas and processors that enable seamless connectivity.\n\nThe project aims to bridge the digital divide by providing reliable internet access to remote and rural communities. SpaceX plans to expand the constellation over the coming years, with the goal of achieving global coverage and supporting various applications from education to emergency communications.",
    author: "Alex Thompson",
    publishedAt: "2024-01-12T16:45:00Z",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop",
    readTime: "4 min read",
    tags: ["Space", "Technology", "Internet", "Innovation"]
  },
  {
    id: 5,
    title: "Olympic Games Set New Records for Sustainability",
    summary: "The latest Olympic Games have achieved unprecedented sustainability goals, setting new standards for major sporting events.",
    content: "The Olympic Games have set a new benchmark for environmental responsibility in major sporting events, achieving remarkable sustainability milestones that will influence future competitions worldwide. The comprehensive sustainability program included carbon-neutral operations, renewable energy usage, and extensive waste reduction initiatives.\n\nKey achievements include the use of 100% renewable energy for all venues, implementation of circular economy principles in construction, and innovative water conservation systems. The organizing committee also prioritized local sourcing and sustainable transportation options for athletes and spectators.\n\nEnvironmental organizations have praised the efforts, noting that the Games demonstrate how large-scale events can be conducted with minimal environmental impact. The sustainability model developed for these Games is already being adopted by other major sporting events and international competitions.",
    author: "Maria Santos",
    publishedAt: "2024-01-11T11:30:00Z",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
    readTime: "5 min read",
    tags: ["Olympics", "Sustainability", "Sports", "Environment"]
  },
  {
    id: 6,
    title: "Breakthrough in Quantum Computing Achieved",
    summary: "Scientists have made a significant breakthrough in quantum computing, bringing practical quantum applications closer to reality.",
    content: "A team of researchers has achieved a major breakthrough in quantum computing technology, solving one of the most challenging problems in the field and bringing practical quantum applications significantly closer to reality. The breakthrough involves improved quantum error correction and enhanced qubit stability.\n\nThe research addresses critical challenges that have limited the practical application of quantum computers, including quantum decoherence and error rates. The new techniques developed by the research team show promise for scaling quantum systems to handle complex real-world problems.\n\nPotential applications include drug discovery, financial modeling, cryptography, and optimization problems that are currently intractable for classical computers. Industry experts believe this breakthrough could accelerate the timeline for practical quantum computing by several years.",
    author: "Dr. James Wilson",
    publishedAt: "2024-01-10T13:20:00Z",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    readTime: "6 min read",
    tags: ["Quantum Computing", "Technology", "Research", "Innovation"]
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All News', icon: '📰' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all articles
export const fetchAllArticles = async () => {
  await delay(800); // Simulate network delay
  return MOCK_ARTICLES;
};

// Fetch articles by category
export const fetchArticlesByCategory = async (category) => {
  await delay(600);
  if (category === 'all') {
    return MOCK_ARTICLES;
  }
  return MOCK_ARTICLES.filter(article => article.category === category);
};

// Fetch single article by ID
export const fetchArticleById = async (id) => {
  await delay(400);
  const article = MOCK_ARTICLES.find(article => article.id === parseInt(id));
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

// Search articles
export const searchArticles = async (query) => {
  await delay(500);
  const searchTerm = query.toLowerCase();
  return MOCK_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.summary.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Get featured articles (first 3)
export const fetchFeaturedArticles = async () => {
  await delay(300);
  return MOCK_ARTICLES.slice(0, 3);
};

// Get categories
export const fetchCategories = async () => {
  await delay(200);
  return CATEGORIES;
};

// Get related articles (same category, excluding current article)
export const fetchRelatedArticles = async (currentArticleId, limit = 3) => {
  await delay(300);
  const currentArticle = MOCK_ARTICLES.find(article => article.id === parseInt(currentArticleId));
  if (!currentArticle) return [];
  
  return MOCK_ARTICLES
    .filter(article => 
      article.id !== currentArticleId && 
      article.category === currentArticle.category
    )
    .slice(0, limit);
};
