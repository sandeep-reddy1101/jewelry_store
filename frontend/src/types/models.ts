export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface WeightUnit {
  id: number;
  name: string;
  symbol: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  barcode: string;
  counter_no: string;
  vendor_id: number;
  category_id: number;
  type_id: number;
  weight_unit_id: number;
  purity: number;
  gross_weight: number;
  net_weight: number;
  beads_weight: number;
  cost_per_unit: number;
  making_charges: number;
  wastage_charges: number;
  beads_cost: number;
  gst_rate: number;
  total_cost: number;
  sale_price: number;
  discount_percentage: number;
  quantity: number;
  min_stock_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vendor?: Vendor;
  category?: ProductCategory;
  type?: ProductType;
  weight_unit?: WeightUnit;
}

export interface Vendor {
  id: number;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  gst_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  department: string;
  position: string;
  salary: number;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  invoice_number: string;
  total_amount: number;
  discount: number;
  tax: number;
  final_amount: number;
  payment_status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
  user?: User;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
