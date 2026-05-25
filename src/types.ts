export interface Ingredient {
  name: string;
  removable?: boolean;
}

export interface ProductVariant {
  label: string;
  priceExtra: number;
  image?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  badgeColor?: 'orange' | 'pink' | 'green' | 'blue';
  isNew?: boolean;
  isHit?: boolean;
  ingredients?: Ingredient[];
  variants?: ProductVariant[];
  doughOptions?: string[];
  available?: boolean;
  partnerId?: string;
}

export interface PromoCard {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  image: string;
  bgColor: string;
  productId?: string;
  partnerId?: string;
  videoUrl?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSize?: number;
  selectedDough?: number;
  removedIngredients?: string[];
}

export interface Category {
  id: string;
  label: string;
  restaurantName?: string;
  logoColor?: string;
  logoChar?: string;
}
