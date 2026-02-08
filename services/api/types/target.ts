export interface TargetSummary {
  message: string;
  totalTarget: number;
  totalAchievement: number;
  status: string;
}

export interface SummaryResult {
  pending: number;
  completed: number;
}

export interface TargetData {
  targetSummery: TargetSummary;
  orderResult: SummaryResult;
  claimResult: SummaryResult;
  month: string;
  startOfMonth: string;
  endOfMonth: string;
}

export interface TargetResponse {
  status: number;
  message: string;
  data: TargetData;
}

// Orders and Claims History Types
export interface KYCDetails {
  _id: string;
  createdBy: string;
  shop_name: string;
  business_type: string;
  shop_location: string;
  tradeLicenseNumber: string;
  tradeLicenseRegistrationDate: string;
  tradeLicenseExpiryDate: string;
  documents: {
    tradeLicense: string;
  };
  shop_address: string;
  post: string;
  business_hours: string;
  shop_contact_number: string;
  shop_photo_logo: string;
  kycStatus: string;
  isAccount_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetails {
  _id: string;
  orderId: string;
  userId: string;
  stockIdByVendor: string;
  vendorId: string;
  quantity: number;
  freeQuantity: number;
  price: number;
  warehouseId: string;
  totalPrice: number;
  isDiscounted: boolean;
  discount: number | null;
  status: string;
  agentStatus: string;
  warranty_type: string;
  warrantyPeriod: number;
  paymentStatus: string;
  isDeleted: boolean;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  agentNote: string;
  assignedToSalesAgent: string;
  deliveryDate: string;
  paymentMethod: string;
}

export interface StockDetails {
  _id: string;
  productId: string;
  requestedBy: string;
  stock: string;
  price_normal_customer: number;
  price_loyal_customer: number;
  soldCount: number;
  warranty_type: string;
  warrantyPeriod: number;
  status: string;
  isSuspend: boolean;
  availableWarehouses: {
    warehouseId: string;
    stock: number;
    status: boolean;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  hidePrice: boolean;
}

export interface VendorDetails {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: string;
  isSuspend: boolean;
  isAccount_deleted: boolean;
  salesAgentOwner: string | null;
  location: string;
  eidNo: string;
  eidFile: string;
  active_plan: string | null;
  designation: string;
  language: string[];
  salesAgentTarget: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetails {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: string;
  isSuspend: boolean;
  isAccount_deleted: boolean;
  salesAgentOwner: string | null;
  location: string;
  eidNo: string;
  eidFile: string | null;
  eidExpiryDate: string | null;
  active_plan: string | null;
  language: string[];
  salesAgentTarget: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimItem {
  _id: string;
  claimId: string;
  userId: string;
  orderId: string;
  vendorId: string;
  warehouseId: string;
  claimProductQuantity: number;
  reason: string;
  userAttchedImgs: string[];
  status: string;
  isDeleted: boolean;
  agentStatus: string;
  requestedDate: string;
  groupedClaimQuantity: any[];
  createdAt: string;
  updatedAt: string;
  assignedDate: string;
  assignedToSalesAgent: string;
  kycDetails: KYCDetails;
  orderDetails: OrderDetails;
  stockDetails: StockDetails;
  vendorDetails: VendorDetails;
  userDetails: UserDetails;
}

export interface OrdersClaimHistoryData {
  result: ClaimItem[];
  total: number;
  currentPage: number;
  totalPages: number;
  message: string;
}

export interface OrdersClaimHistoryResponse {
  status: number;
  message: string;
  data: OrdersClaimHistoryData;
}
