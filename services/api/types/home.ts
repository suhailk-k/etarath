import { Claim } from "./claim";
import { Order } from "./order";

export interface DashboardCount {
  totalAssignedOrders: number;
  totalPendingOrders: number;
  totalAssignedClaims: number;
  totalPendingClaims: number;
  stockOutProducts: number;
  limitedStockProducts: number;
}

export interface DashboardOrders {
  result: Order[];
  message: string;
}

export interface DashboardClaims {
  result: Claim[];
  message: string;
}

export interface DashboardProgressBarData {
  target: number;
  achievement: number;
  progress: number;
  status: string;
  performance: string;
  orderResult: {
    pending: number;
    completed: number;
  };
  claimResult: {
    pending: number;
    completed: number;
  };
  month: string;
  startDate: string;
  endDate: string;
}

export interface DashboardProgressBar {
  message: string;
  data: DashboardProgressBarData;
}

export interface DashboardData {
  count: DashboardCount;
  orders: DashboardOrders;
  claim: DashboardClaims;
  ProgressBar: DashboardProgressBar;
}

export interface HomeResponse {
  status: number;
  message: string;
  data: DashboardData;
}
