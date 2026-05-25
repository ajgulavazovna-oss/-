// @refresh reset
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ProductVariant, Ingredient } from '../types';

export interface AdminCategory {
  id: string;
  label: string;
  sortOrder: number;
  active: boolean;
  restaurantName?: string;
  logoColor?: string;
  logoChar?: string;
}

export interface AdminPartner {
  id: string;
  name: string;
  type: string;
  owner: string;
  phone: string;
  address: string;
  status: 'active' | 'hidden' | 'blocked' | 'moderation';
  logo?: string;
  banner?: string;
  workOpen?: string;
  workClose?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  partnerId: string;
  badge?: string;
  badgeColor?: 'orange' | 'pink' | 'green' | 'blue';
  isNew?: boolean;
  isHit?: boolean;
  available: boolean;
  popular: boolean;
  ingredients?: Ingredient[];
  variants?: ProductVariant[];
  doughOptions?: string[];
}

export interface AdminSponsor {
  id: string;
  name: string;
  image?: string;
  videoUrl?: string;
  partnerId?: string;
  productId?: string;
  placement: 'banner' | 'top' | 'promo' | 'partner_promo';
  active: boolean;
  bgColor?: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  variantLabels?: string[];
  variantImages?: string[];
}

export interface CartSuggestionVariant {
  label: string;
  price: number;
}

export interface AdminCartSuggestion {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image?: string;
  active: boolean;
  variants?: CartSuggestionVariant[];
}

export interface AdminOrder {
  id: string;
  customer: string;
  address: string;
  items: string;
  total: number;
  status: 'new' | 'cooking' | 'delivering' | 'done' | 'cancelled';
  createdAt: number;
  payment: string;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spent: number;
  level: 'vip' | 'normal' | 'suspicious';
  status: 'active' | 'blocked';
  joined: string;
}

export interface AdminSettings {
  notifOrders: boolean;
  notifPush: boolean;
  maintenanceMode: boolean;
  autoAccept: boolean;
  commission: number;
  deliveryFee: number;
  deliveryFree: boolean;
}

interface DbData {
  categories: AdminCategory[];
  partners: AdminPartner[];
  products: AdminProduct[];
  sponsors: AdminSponsor[];
  orders: AdminOrder[];
  users: AdminUser[];
  settings: AdminSettings;
  cartSuggestions: AdminCartSuggestion[];
}

interface AdminDataContextType {
  categories: AdminCategory[];
  partners: AdminPartner[];
  products: AdminProduct[];
  sponsors: AdminSponsor[];
  orders: AdminOrder[];
  users: AdminUser[];
  settings: AdminSettings;
  cartSuggestions: AdminCartSuggestion[];
  loading: boolean;

  addCategory: (c: Omit<AdminCategory, 'id'>) => void;
  updateCategory: (id: string, c: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  addPartner: (p: Omit<AdminPartner, 'id'>) => void;
  updatePartner: (id: string, p: Partial<AdminPartner>) => void;
  deletePartner: (id: string) => void;

  addProduct: (p: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (id: string, p: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  addSponsor: (s: Omit<AdminSponsor, 'id'>) => void;
  updateSponsor: (id: string, s: Partial<AdminSponsor>) => void;
  deleteSponsor: (id: string) => void;

  updateOrderStatus: (id: string, status: AdminOrder['status']) => void;
  deleteOrder: (id: string) => void;

  updateUser: (id: string, u: Partial<AdminUser>) => void;

  updateSettings: (s: Partial<AdminSettings>) => void;

  addCartSuggestion: (s: Omit<AdminCartSuggestion, 'id'>) => void;
  updateCartSuggestion: (id: string, s: Partial<AdminCartSuggestion>) => void;
  deleteCartSuggestion: (id: string) => void;

  resetAllData: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_SETTINGS: AdminSettings = {
  notifOrders: true,
  notifPush: true,
  maintenanceMode: false,
  autoAccept: false,
  commission: 15,
  deliveryFee: 0,
  deliveryFree: true,
};

const DEFAULT_CART_SUGGESTIONS: AdminCartSuggestion[] = [
  { id: 'suggest-fries',  name: 'Картошка-фри', subtitle: 'Хрустящая, горячая', price: 80,  image: '/fries-card.png',  active: true },
  { id: 'suggest-coffee', name: 'Кофе',          subtitle: 'Арабика, 200 мл',    price: 100, image: '/coffee-card.png', active: true },
  {
    id: 'suggest-cola', name: 'Кока-Кола', subtitle: 'Выберите объём', price: 80, image: '/cola-card.png', active: true,
    variants: [
      { label: '0.5 л', price: 80 },
      { label: '1 л',   price: 130 },
      { label: '2 л',   price: 200 },
    ],
  },
];

const EMPTY_DB: DbData = {
  categories: [],
  partners: [],
  products: [],
  sponsors: [],
  orders: [],
  users: [],
  settings: DEFAULT_SETTINGS,
  cartSuggestions: DEFAULT_CART_SUGGESTIONS,
};

async function fetchData(): Promise<DbData> {
  const res = await fetch('/api/data');
  if (!res.ok) throw new Error('Failed to fetch data');
  const raw = await res.json();
  return {
    ...EMPTY_DB,
    ...raw,
    cartSuggestions: Array.isArray(raw.cartSuggestions) && raw.cartSuggestions.length > 0
      ? raw.cartSuggestions
      : EMPTY_DB.cartSuggestions,
  };
}

async function saveData(data: DbData): Promise<void> {
  await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DbData>(EMPTY_DB);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDbRef = useRef<DbData>(EMPTY_DB);
  const initializedRef = useRef(false);

  useEffect(() => {
    fetchData()
      .then(data => {
        setDb(data);
        latestDbRef.current = data;
        initializedRef.current = true;
        setLoading(false);
      })
      .catch(err => {
        console.error('API unavailable, using empty data', err);
        initializedRef.current = true;
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(data => {
        setDb(prev => {
          const prevStr = JSON.stringify(prev);
          const nextStr = JSON.stringify(data);
          if (prevStr !== nextStr) {
            latestDbRef.current = data;
            return data;
          }
          return prev;
        });
      }).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const persist = useCallback((updater: (prev: DbData) => DbData) => {
    setDb(prev => {
      const next = updater(prev);
      latestDbRef.current = next;
      if (!initializedRef.current) return next;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveData(latestDbRef.current).catch(err => console.error('Save failed:', err));
      }, 150);
      return next;
    });
  }, []);

  const addCategory = useCallback((c: Omit<AdminCategory, 'id'>) => {
    persist(prev => ({ ...prev, categories: [...prev.categories, { ...c, id: uid() }] }));
  }, [persist]);
  const updateCategory = useCallback((id: string, c: Partial<AdminCategory>) => {
    persist(prev => ({ ...prev, categories: prev.categories.map(x => x.id === id ? { ...x, ...c } : x) }));
  }, [persist]);
  const deleteCategory = useCallback((id: string) => {
    persist(prev => ({ ...prev, categories: prev.categories.filter(x => x.id !== id) }));
  }, [persist]);

  const addPartner = useCallback((p: Omit<AdminPartner, 'id'>) => {
    persist(prev => ({ ...prev, partners: [...prev.partners, { ...p, id: uid() }] }));
  }, [persist]);
  const updatePartner = useCallback((id: string, p: Partial<AdminPartner>) => {
    persist(prev => ({ ...prev, partners: prev.partners.map(x => x.id === id ? { ...x, ...p } : x) }));
  }, [persist]);
  const deletePartner = useCallback((id: string) => {
    persist(prev => ({ ...prev, partners: prev.partners.filter(x => x.id !== id) }));
  }, [persist]);

  const addProduct = useCallback((p: Omit<AdminProduct, 'id'>) => {
    persist(prev => ({ ...prev, products: [...prev.products, { ...p, id: uid() }] }));
  }, [persist]);
  const updateProduct = useCallback((id: string, p: Partial<AdminProduct>) => {
    persist(prev => ({ ...prev, products: prev.products.map(x => x.id === id ? { ...x, ...p } : x) }));
  }, [persist]);
  const deleteProduct = useCallback((id: string) => {
    persist(prev => ({ ...prev, products: prev.products.filter(x => x.id !== id) }));
  }, [persist]);

  const addSponsor = useCallback((s: Omit<AdminSponsor, 'id'>) => {
    persist(prev => ({ ...prev, sponsors: [...prev.sponsors, { ...s, id: uid() }] }));
  }, [persist]);
  const updateSponsor = useCallback((id: string, s: Partial<AdminSponsor>) => {
    persist(prev => ({ ...prev, sponsors: prev.sponsors.map(x => x.id === id ? { ...x, ...s } : x) }));
  }, [persist]);
  const deleteSponsor = useCallback((id: string) => {
    persist(prev => ({ ...prev, sponsors: prev.sponsors.filter(x => x.id !== id) }));
  }, [persist]);

  const updateOrderStatus = useCallback((id: string, status: AdminOrder['status']) => {
    persist(prev => ({ ...prev, orders: prev.orders.map(x => x.id === id ? { ...x, status } : x) }));
  }, [persist]);
  const deleteOrder = useCallback((id: string) => {
    persist(prev => ({ ...prev, orders: prev.orders.filter(x => x.id !== id) }));
  }, [persist]);

  const updateUser = useCallback((id: string, u: Partial<AdminUser>) => {
    persist(prev => ({ ...prev, users: prev.users.map(x => x.id === id ? { ...x, ...u } : x) }));
  }, [persist]);

  const updateSettings = useCallback((s: Partial<AdminSettings>) => {
    persist(prev => ({ ...prev, settings: { ...prev.settings, ...s } }));
  }, [persist]);

  const addCartSuggestion = useCallback((s: Omit<AdminCartSuggestion, 'id'>) => {
    persist(prev => ({ ...prev, cartSuggestions: [...(prev.cartSuggestions ?? DEFAULT_CART_SUGGESTIONS), { ...s, id: uid() }] }));
  }, [persist]);
  const updateCartSuggestion = useCallback((id: string, s: Partial<AdminCartSuggestion>) => {
    persist(prev => ({ ...prev, cartSuggestions: (prev.cartSuggestions ?? DEFAULT_CART_SUGGESTIONS).map(x => x.id === id ? { ...x, ...s } : x) }));
  }, [persist]);
  const deleteCartSuggestion = useCallback((id: string) => {
    persist(prev => ({ ...prev, cartSuggestions: (prev.cartSuggestions ?? DEFAULT_CART_SUGGESTIONS).filter(x => x.id !== id) }));
  }, [persist]);

  const resetAllData = useCallback(() => {
    fetch('/api/reset', { method: 'POST' })
      .then(() => fetchData())
      .then(data => {
        setDb(data);
        latestDbRef.current = data;
      })
      .catch(console.error);
  }, []);

  return (
    <AdminDataContext.Provider value={{
      categories: db.categories,
      partners: db.partners,
      products: db.products,
      sponsors: db.sponsors,
      orders: db.orders,
      users: db.users,
      settings: db.settings,
      cartSuggestions: db.cartSuggestions ?? DEFAULT_CART_SUGGESTIONS,
      loading,
      addCategory, updateCategory, deleteCategory,
      addPartner, updatePartner, deletePartner,
      addProduct, updateProduct, deleteProduct,
      addSponsor, updateSponsor, deleteSponsor,
      updateOrderStatus, deleteOrder,
      updateUser,
      updateSettings,
      addCartSuggestion, updateCartSuggestion, deleteCartSuggestion,
      resetAllData,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
}
