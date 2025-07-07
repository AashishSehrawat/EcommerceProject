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
