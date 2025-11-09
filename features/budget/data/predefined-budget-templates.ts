import { type BudgetTemplateBase } from "~/features/budget/types/budget-template";

export const DEFAULT_BUDGET_TEMPLATES: Array<BudgetTemplateBase> = [
  // ===== YOUNG PROFESSIONAL ===== //
  {
    id: "young_professional",
    name: "Young Professional",
    description:
      "For people starting their professional career who want to balance work life with enjoyment and building their future.",
    icon: "briefcase",
    targetIncome: {
      min: 4000,
      max: 8000
    },
    characteristics: [
      "Stable employment",
      "No dependents",
      "City living",
      "Active lifestyle",
      "Investing in career development"
    ],
    totalPercentage: 100,
    isActive: true,
    isRecommended: true,
    allocations: [
      {
        type: "needs",
        percentage: 50,
        label: "Needs",
        categories: [
          {
            id: "housing",
            name: "Housing",
            description: "Rent, utilities, internet",
            icon: "home",
            color: "#EF4444",
            percentage: 25,
            order: 1,
            examples: ["Rent", "Electricity", "Gas", "Water", "Internet", "Trash"]
          },
          {
            id: "groceries",
            name: "Groceries",
            description: "Daily shopping and essentials",
            icon: "shopping-cart",
            color: "#F59E0B",
            percentage: 12,
            order: 2,
            examples: ["Supermarket", "Vegetables and fruits", "Bread", "Meat"]
          },
          {
            id: "transportation",
            name: "Transportation",
            description: "Commute to work and daily travel",
            icon: "car",
            color: "#3B82F6",
            percentage: 8,
            order: 3,
            examples: ["Gas", "Monthly pass", "Uber", "Parking"]
          },
          {
            id: "health",
            name: "Health",
            description: "Health insurance, doctors, medications",
            icon: "heart",
            color: "#EC4899",
            percentage: 5,
            order: 4,
            examples: ["Private health insurance", "Medications", "Glasses", "Dentist"]
          }
        ]
      },
      {
        type: "wants",
        percentage: 30,
        label: "Wants",
        categories: [
          {
            id: "entertainment",
            name: "Entertainment",
            description: "Going out, cinema, cultural events",
            icon: "film",
            color: "#8B5CF6",
            percentage: 10,
            order: 5,
            examples: ["Cinema", "Theater", "Concerts", "Netflix", "Spotify"]
          },
          {
            id: "dining_out",
            name: "Dining Out & Cafes",
            description: "Eating outside home",
            icon: "coffee",
            color: "#F97316",
            percentage: 8,
            order: 6,
            examples: ["Restaurants", "Fast food", "Cafes", "Bars"]
          },
          {
            id: "shopping",
            name: "Shopping",
            description: "Clothes, electronics, gadgets",
            icon: "shopping-bag",
            color: "#14B8A6",
            percentage: 7,
            order: 7,
            examples: ["Clothes", "Shoes", "Accessories", "Electronics"]
          },
          {
            id: "hobbies",
            name: "Hobbies & Sports",
            description: "Gym, hobbies, courses",
            icon: "dumbbell",
            color: "#10B981",
            percentage: 5,
            order: 8,
            examples: ["Gym", "Pool", "Online courses", "Sports equipment"]
          }
        ]
      },
      {
        type: "savings",
        percentage: 20,
        label: "Savings",
        categories: [
          {
            id: "emergency_fund",
            name: "Emergency Fund",
            description: "Financial cushion for unexpected expenses",
            icon: "shield",
            color: "#06B6D4",
            percentage: 10,
            order: 9,
            examples: ["Savings account", "Term deposit"]
          },
          {
            id: "investments",
            name: "Investments",
            description: "Stocks, funds, ETFs",
            icon: "trending-up",
            color: "#8B5CF6",
            percentage: 7,
            order: 10,
            examples: ["Stocks", "ETFs", "Investment funds", "Crypto"]
          },
          {
            id: "future_goals",
            name: "Future Goals",
            description: "Saving for specific goals",
            icon: "target",
            color: "#A855F7",
            percentage: 3,
            order: 11,
            examples: ["Vacation", "New laptop", "Car", "Apartment"]
          }
        ]
      }
    ]
  },

  // ===== FAMILY =====
  {
    id: "family",
    name: "Family",
    description:
      "For families with children who prioritize financial security and expenses related to raising children.",
    icon: "users",
    targetIncome: {
      min: 6000,
      max: 15000
    },
    characteristics: [
      "One or more children",
      "Higher housing costs",
      "Children's education expenses",
      "Focus on financial security",
      "Long-term planning"
    ],
    totalPercentage: 100,
    isActive: true,
    isRecommended: false,
    allocations: [
      {
        type: "needs",
        percentage: 60,
        label: "Needs",
        categories: [
          {
            id: "housing",
            name: "Housing",
            description: "Rent/mortgage, utilities",
            icon: "home",
            color: "#EF4444",
            percentage: 30,
            order: 1,
            examples: ["Mortgage payment", "Rent", "Utilities", "Home insurance"]
          },
          {
            id: "groceries",
            name: "Groceries",
            description: "Food for the whole family",
            icon: "shopping-cart",
            color: "#F59E0B",
            percentage: 15,
            order: 2,
            examples: ["Supermarket", "Children's items", "Diapers"]
          },
          {
            id: "children_education",
            name: "Children's Education",
            description: "School, kindergarten, tutoring",
            icon: "graduation-cap",
            color: "#3B82F6",
            percentage: 8,
            order: 3,
            examples: ["Kindergarten", "Private school", "Tutoring", "Textbooks"]
          },
          {
            id: "transportation",
            name: "Transportation",
            description: "Family car, commutes",
            icon: "car",
            color: "#06B6D4",
            percentage: 5,
            order: 4,
            examples: ["Gas", "Car insurance", "Maintenance", "Parking"]
          },
          {
            id: "health",
            name: "Family Health",
            description: "Medical care for everyone",
            icon: "heart",
            color: "#EC4899",
            percentage: 2,
            order: 5,
            examples: ["Family insurance", "Medications", "Doctor visits"]
          }
        ]
      },
      {
        type: "wants",
        percentage: 20,
        label: "Wants",
        categories: [
          {
            id: "family_entertainment",
            name: "Family Entertainment",
            description: "Outings with children, toys",
            icon: "party-popper",
            color: "#8B5CF6",
            percentage: 8,
            order: 6,
            examples: ["Zoo", "Cinema", "Playground", "Toys"]
          },
          {
            id: "dining_out",
            name: "Restaurants",
            description: "Dining out",
            icon: "coffee",
            color: "#F97316",
            percentage: 5,
            order: 7,
            examples: ["Family restaurants", "Pizza", "Fast food"]
          },
          {
            id: "parents_hobbies",
            name: "Parents' Hobbies",
            description: "Time for yourself",
            icon: "smile",
            color: "#10B981",
            percentage: 4,
            order: 8,
            examples: ["Books", "Hobbies", "Small pleasures"]
          },
          {
            id: "vacation",
            name: "Family Vacation",
            description: "Trips with family",
            icon: "palmtree",
            color: "#14B8A6",
            percentage: 3,
            order: 9,
            examples: ["Holidays", "Weekend getaway", "Trips"]
          }
        ]
      },
      {
        type: "savings",
        percentage: 20,
        label: "Savings",
        categories: [
          {
            id: "emergency_fund",
            name: "Emergency Fund",
            description: "Larger cushion for family",
            icon: "shield",
            color: "#06B6D4",
            percentage: 12,
            order: 10,
            examples: ["Savings account", "6 months reserve"]
          },
          {
            id: "children_future",
            name: "Children's Future",
            description: "College, starting life",
            icon: "baby",
            color: "#A855F7",
            percentage: 5,
            order: 11,
            examples: ["Child's account", "Education policy"]
          },
          {
            id: "retirement",
            name: "Retirement",
            description: "Long-term savings",
            icon: "landmark",
            color: "#8B5CF6",
            percentage: 3,
            order: 12,
            examples: ["401k", "IRA", "Retirement fund"]
          }
        ]
      }
    ]
  },

  // ===== AGGRESSIVE SAVER =====
  {
    id: "aggressive_saver",
    name: "Aggressive Saver",
    description:
      "For those who want to achieve financial independence quickly and are ready to significantly limit current expenses.",
    icon: "piggy-bank",
    targetIncome: {
      min: 5000,
      max: 20000
    },
    characteristics: [
      "Goal: FIRE (Financial Independence, Retire Early)",
      "Minimalistic lifestyle",
      "Maximum savings rate",
      "Focus on investments",
      "Sacrificing short-term pleasures"
    ],
    totalPercentage: 100,
    isActive: true,
    isRecommended: false,
    allocations: [
      {
        type: "needs",
        percentage: 40,
        label: "Needs",
        categories: [
          {
            id: "housing",
            name: "Housing",
            description: "Minimal rent or shared apartment",
            icon: "home",
            color: "#EF4444",
            percentage: 20,
            order: 1,
            examples: ["Shared apartment", "Small flat", "Utilities"]
          },
          {
            id: "groceries",
            name: "Groceries",
            description: "Basic products, meal prep",
            icon: "shopping-cart",
            color: "#F59E0B",
            percentage: 10,
            order: 2,
            examples: ["Discount stores", "Bulk buying", "Meal planning"]
          },
          {
            id: "transportation",
            name: "Transportation",
            description: "Public transport, bike",
            icon: "bike",
            color: "#3B82F6",
            percentage: 5,
            order: 3,
            examples: ["Monthly pass", "Bike", "Walking"]
          },
          {
            id: "health",
            name: "Health",
            description: "Basic insurance",
            icon: "heart",
            color: "#EC4899",
            percentage: 5,
            order: 4,
            examples: ["Basic insurance", "Prevention"]
          }
        ]
      },
      {
        type: "wants",
        percentage: 10,
        label: "Wants",
        categories: [
          {
            id: "entertainment",
            name: "Entertainment",
            description: "Minimal budget for pleasure",
            icon: "film",
            color: "#8B5CF6",
            percentage: 5,
            order: 5,
            examples: ["Free events", "Streaming", "Library"]
          },
          {
            id: "personal",
            name: "Personal",
            description: "Small personal pleasures",
            icon: "smile",
            color: "#10B981",
            percentage: 5,
            order: 6,
            examples: ["Coffee", "Occasional treats"]
          }
        ]
      },
      {
        type: "savings",
        percentage: 50,
        label: "Savings",
        categories: [
          {
            id: "investments",
            name: "Investments",
            description: "Maximum allocation to investments",
            icon: "trending-up",
            color: "#8B5CF6",
            percentage: 30,
            order: 7,
            examples: ["Index funds", "ETFs", "Stocks", "Real estate"]
          },
          {
            id: "emergency_fund",
            name: "Emergency Fund",
            description: "Building 12-month cushion",
            icon: "shield",
            color: "#06B6D4",
            percentage: 10,
            order: 8,
            examples: ["High-yield savings", "12 months expenses"]
          },
          {
            id: "retirement",
            name: "Retirement",
            description: "Tax-advantaged accounts",
            icon: "landmark",
            color: "#A855F7",
            percentage: 10,
            order: 9,
            examples: ["401k max", "IRA", "Roth IRA"]
          }
        ]
      }
    ]
  },

  // ===== STUDENT =====
  {
    id: "student",
    name: "Student",
    description:
      "For students with limited income who want to learn financial management and save despite tight budget.",
    icon: "book-open",
    targetIncome: {
      min: 0,
      max: 3000
    },
    characteristics: [
      "Limited income (part-time job, stipend)",
      "Student expenses",
      "Living in dorm or shared apartment",
      "Building financial habits",
      "Flexible budget"
    ],
    totalPercentage: 100,
    isActive: true,
    isRecommended: false,
    allocations: [
      {
        type: "needs",
        percentage: 60,
        label: "Needs",
        categories: [
          {
            id: "housing",
            name: "Housing",
            description: "Dorm or shared apartment",
            icon: "home",
            color: "#EF4444",
            percentage: 25,
            order: 1,
            examples: ["Dorm", "Shared apartment", "Utilities"]
          },
          {
            id: "groceries",
            name: "Groceries",
            description: "Basic food shopping",
            icon: "shopping-cart",
            color: "#F59E0B",
            percentage: 15,
            order: 2,
            examples: ["Discount stores", "Cafeteria", "Quick meals"]
          },
          {
            id: "education",
            name: "Education",
            description: "Books, materials, courses",
            icon: "graduation-cap",
            color: "#3B82F6",
            percentage: 10,
            order: 3,
            examples: ["Textbooks", "Scripts", "Study materials", "Software"]
          },
          {
            id: "transportation",
            name: "Transportation",
            description: "Getting to university",
            icon: "bus",
            color: "#06B6D4",
            percentage: 7,
            order: 4,
            examples: ["Student pass", "Bike", "Public transport"]
          },
          {
            id: "health",
            name: "Health",
            description: "Basic care",
            icon: "heart",
            color: "#EC4899",
            percentage: 3,
            order: 5,
            examples: ["Student insurance", "Medications", "Vitamins"]
          }
        ]
      },
      {
        type: "wants",
        percentage: 25,
        label: "Wants",
        categories: [
          {
            id: "entertainment",
            name: "Entertainment",
            description: "Meeting friends, social life",
            icon: "party-popper",
            color: "#8B5CF6",
            percentage: 10,
            order: 6,
            examples: ["Cinema", "Student parties", "Concerts"]
          },
          {
            id: "dining_out",
            name: "Eating Out",
            description: "Occasional eating out",
            icon: "coffee",
            color: "#F97316",
            percentage: 8,
            order: 7,
            examples: ["Fast food", "Coffee", "Pizza"]
          },
          {
            id: "hobbies",
            name: "Hobbies",
            description: "Interests, sports",
            icon: "gamepad-2",
            color: "#10B981",
            percentage: 7,
            order: 8,
            examples: ["Sports", "Gaming", "Music"]
          }
        ]
      },
      {
        type: "savings",
        percentage: 15,
        label: "Savings",
        categories: [
          {
            id: "emergency_fund",
            name: "Emergency Fund",
            description: "Small financial cushion",
            icon: "shield",
            color: "#06B6D4",
            percentage: 10,
            order: 9,
            examples: ["Savings account", "Reserve for emergencies"]
          },
          {
            id: "future_goals",
            name: "Future Goals",
            description: "Saving for after graduation",
            icon: "target",
            color: "#A855F7",
            percentage: 5,
            order: 10,
            examples: ["First job gear", "Apartment deposit", "Laptop"]
          }
        ]
      }
    ]
  },

  // ===== CUSTOM (Empty template) =====
  {
    id: "custom",
    name: "Custom",
    description: "Create your own budget from scratch, fully tailored to your needs.",
    icon: "settings",
    targetIncome: {
      min: 0,
      max: Infinity
    },
    characteristics: [
      "Full flexibility",
      "Personalized categories",
      "Your own allocations",
      "Unique financial situation"
    ],
    totalPercentage: 100,
    isActive: true,
    isRecommended: false,
    allocations: [
      {
        type: "needs",
        percentage: 50,
        label: "Needs",
        categories: []
      },
      {
        type: "wants",
        percentage: 30,
        label: "Wants",
        categories: []
      },
      {
        type: "savings",
        percentage: 20,
        label: "Savings",
        categories: []
      }
    ]
  }
];
