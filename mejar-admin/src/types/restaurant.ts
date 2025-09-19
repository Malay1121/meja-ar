export interface Restaurant {
  restaurantId: string
  name: string
  description: string
  cuisine: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    coverImage?: string
  }
  settings: {
    isActive: boolean
    allowOnlineOrdering: boolean
    showPrices: boolean
    currency: 'INR' | 'USD' | 'EUR' | 'GBP'
    timezone: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  categoryId: string
  name: string
  description?: string
  displayOrder: number
  isActive: boolean
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  itemId: string
  name: string
  description: string
  category: string
  pricing: {
    basePrice: number
    currency: string
    discountPrice?: number
    isDiscounted: boolean
  }
  media: {
    primaryImage?: string
    additionalImages: string[]
    arModel?: string
  }
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    allergens: string[]
  }
  availability: {
    isActive: boolean
    availableDays: string[]
    availableHours?: {
      start: string
      end: string
    }
  }
  tags: string[]
  spicyLevel?: 1 | 2 | 3 | 4 | 5
  isVegan: boolean
  isVegetarian: boolean
  isGlutenFree: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MenuStats {
  totalItems: number
  activeItems: number
  categoriesCount: number
  popularItems: {
    itemId: string
    name: string
    views: number
    orders?: number
  }[]
  recentlyAdded: MenuItem[]
}

export interface RestaurantStats {
  totalViews: number
  menuViews: number
  arInteractions: number
  popularCategories: {
    name: string
    views: number
  }[]
  weeklyStats: {
    date: string
    views: number
    interactions: number
  }[]
  monthlyGrowth: {
    views: number
    interactions: number
    percentageChange: number
  }
}

export type UploadProgressCallback = (progress: number) => void

export interface FileUpload {
  file: File
  preview: string
  type: 'image' | 'model'
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress?: number
  url?: string
  error?: string
}