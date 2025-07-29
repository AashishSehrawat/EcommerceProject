export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  photo: string;
  role: "user" | "admin"; // Assuming role can be either 'user' or 'admin'
  gender: string;
  dob: string; // or Date if you convert it
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

export interface Product {
  _id: string;
  title: string;
  productPhoto: string; 
  price: number;
  stock: number;
  category: "Shoes" | "Laptop" | "Mobile" | "Clothes" | "Accessories" | "Tablets";
  createdBy: IUser; 
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;  
  quantity: number;
  photo: string;
  stock: number;
}

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
}



//----------------------------------- Response ans Request Types -----------------------------------//
export interface CustomError {
  success: boolean;
  message: string;
  statusCode?: number; // Optional, if you want to include a status code
}

export interface RegisterApiResponse {
  success: boolean;
  message?: string;
  user?: IUser;
  statusCode?: number; // Assuming you return a status code on successful registration
}

export interface LoginApiResponse {
  success: boolean;
  message?: string;
  data: {
    user: IUser;
    accessTokenCreated: string; // Assuming you return a token on successful login
  };
  statusCode?: number; // Assuming you return a token on successful login
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  statusCode?: number; // Assuming you return a status code on successful logout
  user?: IUser
}

export interface LatestProductsResponse {
  success: boolean;
  message?: string;
  data: Product[];
  statusCode?: number; // Assuming you return a status code for the latest products
}

export interface CategoryResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  data: string[]; // Assuming categories are strings
}

export interface SearchProductsResponse {
  success: boolean;
  message?: string;
  data: {
    products: Product[];
    totalPages: number;
  };
  statusCode?: number; // Assuming you return a status code for the search results
}

export interface SearchProductsRequest {
  price?: number,
  category?: string,
  page?: number,
  search?: string,
  sort?: string
}

export interface CreateProductResponse {
  success: boolean;
  message?: string;
  data?: Product;
  statusCode?: number; 
}

export interface ProductDetailsResponse {
  success: boolean;
  message?: string;
  data: Product;
  statusCode?: number; // Assuming you return a status code for product details
}

export interface UpdateProductRequest {
  id: string;
  productData: FormData; // Assuming you send FormData for updating product
}

export interface CommonResponse {
  success: boolean;
  message?: string;
  data?: Product; // Assuming you return the deleted product
  statusCode?: number; // Assuming you return a status code for deletion
}

export interface DiscountApplyResponse {
  success: boolean;
  message?: string;
  data?: number;
  statusCode?: number;
}

export interface CreateOrderRequest {
  shippingOrderInfo: ShippingInfo,
  subTotal: number,
  tax: number,
  shippingCharges: number,
  discount: number,
  total: number,
  status: string,
  user: string,
  orderItems: OrderItem[],
}

export interface OrderItem {
  title: string;
  photo: string;
  price: number;
  quantity: number;
  productID: string;
  _id?: string;
}

export interface OrderData {
  shippingOrderInfo: ShippingInfo;
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"; // Add other possible statuses
  orderItems: OrderItem[];
  _id: string;
}

export interface CreateOrderApiResponse {
  statusCode: number;
  message: string;
  data: OrderData;
  success: boolean;
}

export interface MyOrdersResponse {
  statusCode: number;
  message: string;
  data: OrderData[];
  success: boolean;
}

interface AdminOrderData {
  shippingOrderInfo: ShippingInfo;
  user: {
    _id: string,
    name: string,
  };
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"; // Add other possible statuses
  orderItems: OrderItem[];
  _id: string;
}

export interface AllOrdersResponse {
  statusCode: number;
  message: string;
  data: AdminOrderData[];
  success: boolean;
}

export interface SingleOrderDetailsResponse {
  statusCode: number;
  message: string;
  data: OrderData;
  success: boolean;
}

export interface UpdateOrderResponse {
  statusCode: number;
  message: string;
  data: OrderData;
  success: boolean;
}

export interface DeleteOrderResponse {
  statusCode: number;
  message: string;
  data: OrderData;
  success: boolean;
}

export interface PaymentApiResponse {
  statusCode: number;
  message: string;
  data: string; // clientSecret
  success: boolean;
}

export interface AllUsersResponse {
  statusCode: number;
  message: string;
  data: IUser[];
  success: boolean;
}

export interface DeleteUserResponse {
  statusCode: number;
  message: string;
  data: IUser;
  success: boolean;
}

// Dashboard API Types
interface Transaction {
  _id: string;
  discount: number;
  status: string;
  amount: number;
  quantity: number;
}

interface GenderRatio {
  maleCount: number;
  femaleCount: number;
}

interface CategoryCount {
  [key: string]: number;
}

interface CountStats {
  revenue: number;
  user: number;
  order: number;
  product: number;
}

interface ChartData {
  count: number[];
  revenue: number[];
}

interface DashboardStats {
  latestTransaction: Transaction[];
  genderRatio: GenderRatio;
  categoryNameAndCount: CategoryCount[];
  userChangePercent: number;
  productChangePercent: number;
  orderChangePercent: number;
  revenueChangePercent: number;
  count: CountStats;
  chart: ChartData;
}

export interface DashboardStatsResponse {
  statusCode: number;
  message: string;
  data: DashboardStats
  success: boolean;
}
