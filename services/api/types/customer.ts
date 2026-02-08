export interface AssignedUsers {
  userId: string;
  _id: string;
}

export interface CustomerDetails {
  _id: string;
  userId: string;
  userName?: string; // Optional as API uses 'name' primarily
  name: string; // Primary name field from API
  email?: string;
  phoneNumber?: string;
  imgUrl?: string;
  role?: string;
  isVerified?: string;
  isSuspend?: boolean;
  isAccount_deleted?: boolean;
  salesAgentOwner?: string | null;
  location: string;
  shop_photo: string;
  logo: string;
  since: string; // Member since date
  bussines_hours: string; // Note: API has typo "bussines" instead of "business"
  payment_method: string;
  eidNo?: string;
  eidFile?: string;
  eidExpiryDate?: string;
  active_plan?: any;
  language?: any[];
  salesAgentTarget?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  kycDetails?: KycDetails; // Added based on Details API response structure
}

export interface KycDetails {
  _id: string;
  createdBy?: string;
  business_name: string;
  email?: string;
  phoneNumber?: string;
  location: string;
  business_address?: string;
  tradeLicenseNumber?: string;
  tradeLicenseRegistrationDate?: string;
  tradeLicenseExpiryDate?: string;
  documents?: {
    tradeLicense: string;
  };
  post?: string;
  business_hours: string;
  shop_photo_logo: string;
  vendor_logo: string;
  kycStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: any;
}

// The item in the list response (new API structure)
export interface CustomerListItem {
  _id: string;
  userId: string;
  name: string;
  location: string;
  shop_photo: string;
  logo: string;
}

export interface CustomerListData {
  result: CustomerListItem[];
  total: number;
  currentPage: number;
  totalPages: number;
  message: string;
}

export interface CustomerListResponse {
  status: number;
  message: string;
  data: CustomerListData;
}

export interface SingleCustomerDetails {
  customerDetails: CustomerDetails;
  orderCounts: number;
  claimCounts: number;
}

export interface CustomerDetailsResponse {
  status: number;
  message: string;
  data: SingleCustomerDetails;
}
