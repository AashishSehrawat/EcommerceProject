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
