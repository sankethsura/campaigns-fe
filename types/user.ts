export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  currentPlan: string;
  emailsSentThisMonth: number;
  planResetDate: string;
  subscriptionActive: boolean;
  subscriptionStartDate?: string;
  lastPaymentId?: string;
  createdAt: string;
  lastLogin: string;
}
