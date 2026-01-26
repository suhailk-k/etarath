export interface LoginParams {
  mobile: string;
  password?: string;
}

export interface LoginPayload {
  usr: string;
  pwd?: string;
}

export interface SendOtpParams {
  mobile: string;
}

// FormData payload, so no specific interface for JSON body usually, 
// but we can type the params we append.
export interface SendOtpPayload {
    emailOrPhoneNumber: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  imgUrl: string;
  role: string;
  isVerified: string;
  isSuspend: boolean;
  isAccount_deleted: boolean;
  salesAgentOwner: string;
  location: string;
  eidNo: string;
  eidFile: string;
  active_plan: null | any;
  language: any[];
  salesAgentTarget: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SendOtpResponse {
  status: number;
  message: string;
  data: {
    data: User;
    message: string;
  };
}

export interface VerifyOtpResponse {
  status: number;
  message: string;
  data: {
    userData: User;
    token: string;
  };
}

export interface VerifyOtpParams {
  mobile: string;
  otp: string;
}

export interface VerifyOtpPayload {
  emailOrPhoneNumber: string;
  otp: string;
}

export interface BaseResponse<T = any> {
    message: string;
    data?: T;
    // Add other common response fields if known
}

export interface Brand {
  _id: string;
  name: string;
  imageUrl: string;
  imageUrl2?: string;
  isActive: boolean;
  priority: number;
}

export interface ProductDetails {
  _id: string;
  productName: string;
  brand: string;
  category: string;
  imageUrl: string[];
  mrp: number;
  origin: string;
  yearOfManufacturer: string;
  width: number;
  height: number;
  size: string;
  description: string;
  features: string[];
  isVerified: string;
  isSuspend: boolean;
  createdBY: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BrandDetails {
  _id: string;
  name: string;
  imageUrl: string;
  imageUrl2: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
    _id: string;
    productId: string;
    requestedBy: string;
    stock: string;
    location: null | string;
    price_normal_customer: number;
    price_loyal_customer: number;
    soldCount: number;
    warranty_type: string;
    warrantyPeriod: number;
    description: null | string;
    status: string;
    isSuspend: boolean;
    ProductOffer: null | any;
    productDetails: ProductDetails;
    brandDetails: BrandDetails;
    originDetails: any; // Add specific type if needed
    yearOfManufacturerDetails: any; // Add specific type if needed
    vendorDetails: any; // Add specific type if needed
    kycDetails: any; // Add specific type if needed
    productOfferDetails: null | any;
    availableWarehouses: any[]; // Add specific type if needed
}

export interface ProductResponse {
    result: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
    message: string;
}
