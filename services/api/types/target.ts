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
