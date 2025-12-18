import { Project, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
  "name": "Nirmal Justin",
  "title": "AI Powered Designer",
  "tagline": "I love watching movies, so why not a portfolio like that?",
  "bio": "Specializing in complex systems, AI interfaces, and educational platforms.",
  "heroImage": "https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop",
  "heroVideo": "https://www.youtube.com/watch?v=LXb3EKWsInQ",
  "avatar": "https://ui-avatars.com/api/?name=Nirmal+Justin&background=0D8ABC&color=fff",
  "email": "n.justinoff@gmail.com",
  "resumeUrl": "components/Nirmal Justin UIUX Designer Resume Final.pdf",
  "socials": {
    "linkedin": "https://linkedin.com",
    "dribbble": "https://dribbble.com",
    "twitter": "https://twitter.com"
  },
  "availability": {
    "status": "date",
    "date": "2025-06-27"
  }
};

const SAMPLE_GALLERY = [
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
];

const LOREM_IPSUM = `
  <h3 class="text-2xl font-bold mb-4 text-white">The Challenge</h3>
  <p class="mb-6 text-gray-300 leading-relaxed">
    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.
  </p>
  <h3 class="text-2xl font-bold mb-4 text-white">The Solution</h3>
  <p class="mb-6 text-gray-300 leading-relaxed">
    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask "Show me the scene where the detective finds the red notebook," and the system jumps directly to that timestamp.
  </p>
  <h3 class="text-2xl font-bold mb-4 text-white">Key Features</h3>
  <ul class="list-disc list-inside mb-6 text-gray-300 space-y-2">
    <li>Contextual Voice Search</li>
    <li>Scene-level indexing</li>
    <li>Personalized "Mood" recommendations</li>
  </ul>
`;

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "1",
    "title": "Netflix TV App Redesign",
    "description": "An AI-powered search experience with voice control that understands natural queries to find specific episodes, scenes, or moments without scrubbing.",
    "imageUrl": "https://images.unsplash.com/photo-1574375927938-d5a98e8efe30?q=80&w=2069&auto=format&fit=crop",
    "heroVideo": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "category": "Featured Projects",
    "mainTag": "Highly Recommended",
    "role": "Lead UX/UI Designer",
    "platform": "TV App",
    "tags": [
      "AI Search",
      "Voice Control",
      "Streaming"
    ],
    "year": 2025,
    "link": "#",
    "gallery": [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    ],
    "fullDescription": "\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Challenge</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Solution</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask \"Show me the scene where the detective finds the red notebook,\" and the system jumps directly to that timestamp.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">Key Features</h3>\n  <ul class=\"list-disc list-inside mb-6 text-gray-300 space-y-2\">\n    <li>Contextual Voice Search</li>\n    <li>Scene-level indexing</li>\n    <li>Personalized \"Mood\" recommendations</li>\n  </ul>\n"
  },
  {
    "id": "2",
    "title": "Guardian Bubble",
    "description": "A multi-platform safety ecosystem designed to protect children through real-time GPS tracking, digital monitoring, and emergency response.",
    "imageUrl": "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?q=80&w=2070&auto=format&fit=crop",
    "category": "Featured Projects",
    "mainTag": "Featured",
    "role": "Lead UX/UI Designer",
    "platform": "iOS, Android, Web",
    "tags": [
      "Child Safety",
      "Real-time GPS",
      "AI Insights"
    ],
    "year": 2025,
    "link": "#",
    "gallery": [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    ],
    "fullDescription": "\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Challenge</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Solution</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask \"Show me the scene where the detective finds the red notebook,\" and the system jumps directly to that timestamp.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">Key Features</h3>\n  <ul class=\"list-disc list-inside mb-6 text-gray-300 space-y-2\">\n    <li>Contextual Voice Search</li>\n    <li>Scene-level indexing</li>\n    <li>Personalized \"Mood\" recommendations</li>\n  </ul>\n"
  },
  {
    "id": "3",
    "title": "The Sportsbook",
    "description": "An all-in-one sports education and management platform streamlining PE curriculum, summer camps, and talent assessments for schools in India.",
    "imageUrl": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    "category": "Featured Projects",
    "mainTag": "Featured",
    "role": "Lead UX/UI Designer",
    "platform": "iOS, Android, Web",
    "tags": [
      "EdTech",
      "Sports Management",
      "SaaS"
    ],
    "year": 2025,
    "link": "#",
    "gallery": [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    ],
    "fullDescription": "\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Challenge</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Solution</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask \"Show me the scene where the detective finds the red notebook,\" and the system jumps directly to that timestamp.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">Key Features</h3>\n  <ul class=\"list-disc list-inside mb-6 text-gray-300 space-y-2\">\n    <li>Contextual Voice Search</li>\n    <li>Scene-level indexing</li>\n    <li>Personalized \"Mood\" recommendations</li>\n  </ul>\n"
  },
  {
    "id": "4",
    "title": "Sign Language AI",
    "description": "Integrating sign language detection with Google Assistant to make digital assistants accessible to the deaf and hard of hearing community.",
    "imageUrl": "https://images.unsplash.com/photo-1635436368469-e74fbd69a5a7?q=80&w=2070&auto=format&fit=crop",
    "category": "Concept Designs",
    "mainTag": "Concept",
    "role": "Product Designer",
    "platform": "Mobile / AI Assistant",
    "tags": [
      "Accessibility",
      "Computer Vision",
      "AI"
    ],
    "year": 2024,
    "link": "#",
    "gallery": [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    ],
    "fullDescription": "\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Challenge</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Solution</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask \"Show me the scene where the detective finds the red notebook,\" and the system jumps directly to that timestamp.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">Key Features</h3>\n  <ul class=\"list-disc list-inside mb-6 text-gray-300 space-y-2\">\n    <li>Contextual Voice Search</li>\n    <li>Scene-level indexing</li>\n    <li>Personalized \"Mood\" recommendations</li>\n  </ul>\n"
  },
  {
    "id": "5",
    "title": "Vision Pro Color",
    "description": "An AR concept app for Apple Vision Pro assisting individuals with color blindness to perceive true colors in real-time.",
    "imageUrl": "https://images.unsplash.com/photo-1621360841012-39686981882d?q=80&w=2070&auto=format&fit=crop",
    "category": "Concept Designs",
    "mainTag": "Concept",
    "role": "Concept Designer",
    "platform": "Apple Vision Pro",
    "tags": [
      "AR",
      "Accessibility",
      "Vision Pro"
    ],
    "year": 2024,
    "link": "#",
    "gallery": [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    ],
    "fullDescription": "\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Challenge</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    Users often struggle to find specific content within vast libraries of streaming content. The traditional keyword search is often insufficient for vague queries or describing visual moments. Our goal was to integrate an LLM-based search engine that understands context, sentiment, and scene descriptions.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">The Solution</h3>\n  <p class=\"mb-6 text-gray-300 leading-relaxed\">\n    We designed a voice-first interface that sits non-intrusively on top of the viewing experience. By leveraging natural language processing, users can ask \"Show me the scene where the detective finds the red notebook,\" and the system jumps directly to that timestamp.\n  </p>\n  <h3 class=\"text-2xl font-bold mb-4 text-white\">Key Features</h3>\n  <ul class=\"list-disc list-inside mb-6 text-gray-300 space-y-2\">\n    <li>Contextual Voice Search</li>\n    <li>Scene-level indexing</li>\n    <li>Personalized \"Mood\" recommendations</li>\n  </ul>\n"
  }
];
