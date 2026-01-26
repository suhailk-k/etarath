export interface UserProfile {
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
    language: string[];
    salesAgentTarget: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface UserProfileResponse {
    status: number;
    message: string;
    data: UserProfile;
}

export interface UpdateProfilePayload {
    userName?: string;
    email?: string;
    imgUrl?: string;
}
