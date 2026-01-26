
export type OrderStatus = "pending" | "in-progress" | "delivered" | "cancelled";
export type AgentStatus = "new" | "assigned" | "dupdated";
export type PaymentStatus = "unpaid" | "paid";

export interface Order {
    _id: string;
    orderId: string;
    userId: string;
    stockIdByVendor: string;
    vendorId: string;
    quantity: number;
    freeQuantity: number;
    price: number;
    waerehouseId: string;
    totalPrice: number;
    isDiscounted: boolean;
    discount: number;
    status: OrderStatus;
    agentStatus: AgentStatus;
    warranty_type: string;
    warrantyPeriod: number;
    paymentStatus: PaymentStatus;
    orderDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    kycDetails: KycDetails;
    stockDetails: StockDetails;
    vendorDetails: VendorDetails;
    productDetails: ProductDetails;
    warehouseDetails: WarehouseDetails;
    userDetails: UserDetails;
    deliveryDate?: string;
    tempUserDetails: any[];
    note?: string;
    paymentMethod?: string;
}

export interface KycDetails {
    _id: string;
    createdBy: string;
    business_name: string;
    email: string;
    phoneNumber: string;
    location: string;
    business_address: string;
    tradeLicenseNumber: string;
    tradeLicenseRegistrationDate: string;
    tradeLicenseExpiryDate: string;
    documents: {
        tradeLicense: string;
    };
    post: string;
    business_hours: string;
    shop_photo_logo: string;
    vendor_logo: string;
    kycStatus: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
    availableWarehouses: AvailableWarehouse[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AvailableWarehouse {
    warehouseId: string;
    stock: number;
    status: boolean;
    _id: string;
}

export interface VendorDetails {
    _id: string;
    createdBy: string;
    business_name: string;
    email: string;
    phoneNumber: string;
    location: string;
    business_address: string;
    tradeLicenseNumber: string;
    tradeLicenseRegistrationDate: string;
    tradeLicenseExpiryDate: string;
    documents: {
        tradeLicense: string;
    };
    post: string;
    business_hours: string;
    shop_photo_logo: string;
    vendor_logo: string;
    kycStatus: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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

export interface WarehouseDetails {
    _id: string;
    vendorId: string;
    shop_name: string;
    shop_photo_logo: string;
    location: string;
    address: string;
    issuspended: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface UserDetails {
    _id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    imgUrl: string;
    role: string;
    isVerified: string;
    isSuspend: boolean;
    isAccount_deleted: boolean;
    salesAgentOwner: null | string;
    location: string;
    eidNo: string;
    eidFile: string;
    eidExpiryDate: string;
    active_plan: null | any;
    language: any[];
    salesAgentTarget: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface OrdersResponse {
    status: number;
    message: string;
    data: {
        result: Order[];
        total: number;
        currentPage: number;
        totalPages: number;
        message: string;
    };
}

export interface SingleOrderResponse {
    status: number;
    message: string;
    data: Order;
}

export interface CreateOrderResult {
    status: number;
    message: string;
    data: Order;
}

export interface OrderProductPayload {
    productId: string;
    warehouseId: string;
    quantity: number;
}

export interface NewUserDetails {
    userName: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export interface CreateOrderPayload {
    product: OrderProductPayload[];
    userExist: boolean;
    userId?: string;
    userDetails?: NewUserDetails;
}

export interface UpdateOrderPayload {
    status: string;
    price: number;
    paymentMethod: string;
    discount: number;
    note: string;
}
