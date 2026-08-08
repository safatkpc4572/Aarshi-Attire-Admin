export type FabricType =
  | 'Dhakai Muslin'
  | 'Jamdani'
  | 'Banarasi Katan'
  | 'Rajshahi Silk'
  | 'Tassar Silk'
  | 'Organza'
  | 'Georgette'
  | 'Cotton Handloom'
  | 'Tissue Silk'
  | 'Chanderi';

export type CraftType =
  | 'Hand Woven'
  | 'Zari Work'
  | 'Resham Embroidery'
  | 'Hand Block Print'
  | 'Digital Print'
  | 'Gotta Patti'
  | 'Mirror Work'
  | 'Kantha Stitch';

export type CourierService = 'Pathao' | 'Steadfast' | 'RedX' | 'Paperfly' | 'In-House Dhaka Delivery';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Card' | 'Bank Transfer';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface Saree {
  id: string;
  code: string; // e.g. AA-JAM-101
  name: string;
  nameBn: string;
  price: number; // In BDT (৳)
  salePrice?: number; // Discounted price
  sourcingCost: number; // Weaver/sourcing cost in BDT
  fabric: FabricType;
  craft: CraftType;
  color: string;
  colorHex: string;
  blouseOption: 'Unstitched Included' | 'Stitched Custom' | 'Without Blouse';
  stock: number;
  reorderLevel: number; // Low stock alert threshold
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  description: string;
  descriptionBn: string;
  careInstructions: string;
  imageUrl: string;
  additionalImages?: string[];
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface OrderItem {
  sareeId: string;
  sareeCode: string;
  sareeName: string;
  price: number;
  quantity: number;
  fabric: string;
  color: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #ORD-2026-8801
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number; // In BDT
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bKashTxnId?: string;
  courierName: CourierService;
  trackingNumber?: string;
  createdAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  vipTier: 'Regular' | 'Silver' | 'Gold' | 'VIP';
  lastOrderDate: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minSpend: number;
  usageLimit: number;
  timesUsed: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetCategory?: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Weaver {
  id: string;
  name: string;
  region: string; // e.g. Demra, Tangail, Rajshahi
  phone: string;
  fabricSpecialty: string;
  sareesSupplied: number;
  pendingPayout: number;
  totalPayout: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  totalSarees: number;
  lowStockCount: number;
  totalCustomers: number;
  grossProfit: number;
}
