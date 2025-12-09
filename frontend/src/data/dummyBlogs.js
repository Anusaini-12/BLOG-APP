// src/data/dummyBlogs.js

export const dummyBlogs = [
  {
    _id: "6743a1b2c5f4b91234a1d001",
    title: "Why MERN Stack Will Rule 2026",
    content:
      "The MERN stack has grown rapidly with Next.js improvements, React Server Components, and faster Node runtimes like Bun...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    category: "Web Development",
    tags: ["mern", "react", "backend"],
    author: { id: "6743a1b2c5f4b91234a10001", name: "John Doe" },
    likes: [
      "6743a1b2c5f4b91234a10002",
      "6743a1b2c5f4b91234a10003"
    ],
    comments: [
      {
        text: "Very informative!",
        user: { id: "6743a1b2c5f4b91234a10004", name: "Jane Smith" },
        createdAt: "2025-11-20T10:45:00Z"
      }
    ],
    isPublished: true,
    createdAt: "2025-11-20T10:30:00Z",
    updatedAt: "2025-11-20T10:30:00Z"
  },

  {
    _id: "6743a1b2c5f4b91234a1d002",
    title: "Top 5 Hidden Travel Destinations in India",
    content:
      "India is filled with unexplored places. From the crystal waters of Ziro Valley to the peaceful villages of Meghalaya...",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
    category: "Travel",
    tags: ["india", "travel", "mountains"],
    author: { id: "6743a1b2c5f4b91234a10005", name: "Alice Brown" },
    likes: ["6743a1b2c5f4b91234a10006"],
    comments: [
      {
        text: "Adding these to my list!",
        user: { id: "6743a1b2c5f4b91234a10007", name: "Robert Lee" },
        createdAt: "2025-11-15T10:00:00Z"
      }
    ],
    isPublished: true,
    createdAt: "2025-11-15T09:15:00Z",
    updatedAt: "2025-11-15T09:15:00Z"
  },

  {
    _id: "6743a1b2c5f4b91234a1d003",
    title: "10 Easy High-Protein Breakfast Recipes",
    content:
      "Breakfast is the most important meal of the day. Here are 10 simple, protein-packed meals like oats, eggs, smoothies...",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200",
    category: "Food",
    tags: ["breakfast", "healthy", "recipes"],
    author: { id: "6743a1b2c5f4b91234a10008", name: "Emma Wilson" },
    likes: [
      "6743a1b2c5f4b91234a10009",
      "6743a1b2c5f4b91234a10010"
    ],
    comments: [
      {
        text: "Yummy!",
        user: { id: "6743a1b2c5f4b91234a10011", name: "Michael Scott" },
        createdAt: "2025-11-12T12:30:00Z"
      }
    ],
    isPublished: true,
    createdAt: "2025-11-12T12:00:00Z",
    updatedAt: "2025-11-12T12:00:00Z"
  },

  {
    _id: "6743a1b2c5f4b91234a1d004",
    title: "How to Lose Weight Without Giving Up Your Favorite Foods",
    content:
      "Weight loss is not about starving. It's about balancing calories, staying active, sleeping well, and staying consistent...",
    image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200",
    category: "Fitness",
    tags: ["fitness", "weight-loss", "health"],
    author: { id: "6743a1b2c5f4b91234a10012", name: "Olivia Johnson" },
    likes: [],
    comments: [],
    isPublished: true,
    createdAt: "2025-10-30T08:20:00Z",
    updatedAt: "2025-10-30T08:20:00Z"
  }
];
