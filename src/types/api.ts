// Laravel API Resource ciktilarina karsilik gelen tipler (tek kaynak: mazen-backend/app/Http/Resources)

export interface BrandSummary {
  name: string;
  slug: string;
}

export interface Brand extends BrandSummary {
  id: number;
  product_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
  level: number;
  parent_id: number | null;
  image: string | null;
  product_count?: number;
  children?: Category[];
}

export interface ProductImageSet {
  thumb: string;
  card: string;
  zoom?: string;
}

export interface ProductSummary {
  id: number;
  sku: string;
  name: string;
  slug: string;
  price: number;
  list_price: number | null;
  in_stock: boolean;
  stock_qty: number;
  brand?: BrandSummary | null;
  image: { thumb: string; card: string } | null;
}

export interface Product extends Omit<ProductSummary, "image"> {
  barcode: string | null;
  description: string | null;
  vat_rate: number;
  brand: (BrandSummary & { id: number }) | null;
  category: Category | null;
  breadcrumb: { name: string; slug: string }[];
  images: ProductImageSet[];
  attributes: Record<string, string | null>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  links: { first: string; last: string; prev: string | null; next: string | null };
}

export interface HomeResponse {
  categories: Category[];
  latest_products: ProductSummary[];
  brands: Brand[];
  stats: { published_products: number };
}

export interface CategoryPageResponse {
  category: Category;
  children: Category[];
  brands: Brand[];
  products: Paginated<ProductSummary>;
}

export interface ProductPageResponse {
  product: Product;
  similar: ProductSummary[];
}

export interface SearchResponse {
  query: string;
  products: Paginated<ProductSummary>;
}

export interface CartItem {
  product: ProductSummary;
  qty: number;
  unit_price: number;
  line_total: number;
  max_qty: number;
}

export interface Cart {
  token: string | null;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  total: number;
}

/** Laravel 422 cevabi */
export interface ValidationErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  marketing_consent: boolean;
  created_at: string | null;
}

export interface BusinessInfo {
  seller_name: string | null;
  brand_name: string | null;
  address: string | null;
  tax_office: string | null;
  tax_number: string | null;
  mersis: string | null;
  phone: string | null;
  email: string | null;
  kep: string | null;
  return_address: string | null;
  dispatch_days: string | null;
}

export interface StoreInfo {
  business: BusinessInfo;
  shipping: { fee: number; free_threshold: number };
}

export type InvoiceType = "individual" | "corporate";

export interface Address {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  province: string;
  district: string;
  address_line: string;
  postal_code: string | null;
  invoice_type: InvoiceType;
  tc_no_masked: string | null;
  company_name: string | null;
  tax_office: string | null;
  tax_number: string | null;
  is_default: boolean;
}

/** Adres formu gonderimi (tc_no sadece yeni girilirse dolu) */
export interface AddressInput {
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  province: string;
  district: string;
  address_line: string;
  postal_code: string;
  invoice_type: InvoiceType;
  tc_no: string;
  company_name: string;
  tax_office: string;
  tax_number: string;
  is_default: boolean;
}
