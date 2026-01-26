import { AgentStatus, KycDetails, StockDetails, UserDetails, VendorDetails } from "./order";

export type ClaimStatus="pending"|"in-progress"|"cancelled"|"verified"|"approved"|"rejected"|"completed"
export interface Claim {
  _id: string;
  claimId: string;
  userId: string;
  orderId: string;
  vendorId: string;
  waerehouseId: string;
  claimProductQuantity: number;
  reason: string;
  userAttchedOfficialImgs: string[];
  userAttchedDefectiveImgs: string[];
  status: ClaimStatus;
  agentStatus: AgentStatus;
  salesAgentAttchedOfficialImgs: string[];
  salesAgentAttchedDefectiveImgs: string[];
  requestedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  kycDetails: KycDetails;
  orderDetails: ClaimOrderDetails;
  stockDetails: StockDetails;
  vendorDetails: VendorDetails;
  userDetails: UserDetails;
}

export interface ClaimOrderDetails {
  _id: string;
  orderId: string;
  userId: string;
  stockIdByVendor: string;
  vendorId: string;
  quantity: number;
  price: number;
  waerehouseId: string;
  totalPrice: number;
  isDiscounted: boolean;
  discount: number;
  status: string;
  warranty_type: string;
  warrantyPeriod: number;
  paymentStatus: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deliveryDate: string;
}

export interface ClaimsResponse {
  status: number;
  message: string;
  data: {
    result: Claim[];
    total: number;
    currentPage: number;
    totalPages: number;
    message: string;
  };
}

export interface SalesAgentAttachedOfficialImgs {
  fullTyrePicture?: string;
  brandName?: string;
  seriaNo?: string;
  dOT?: string;
  pattern?: string;
}

export interface SalesAgentAttachedDefectiveImgs {
  tyreTread?: string;
  defectPicture1?: string;
  defectPicture2?: string;
  innerlinePicture?: string;
  treadDept1?: string;
  treadDept2?: string;
  treadDept3?: string;
  treadDept4?: string;
}

export interface UpdateClaimStatusPayload {
  status?: string;
  salesAgentAttchedOfficialImgs?: SalesAgentAttachedOfficialImgs;
  salesAgentAttchedDefectiveImgs?: SalesAgentAttachedDefectiveImgs;
  checkingRemarks?: string;
  balanceThreshold?: number;
}
