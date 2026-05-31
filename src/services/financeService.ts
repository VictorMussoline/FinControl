import type { DashboardData } from '../types/finance';
import { mockDashboardData } from '../mocks/financeMock';

class FinanceService {
  public async getDashboardData(): Promise<DashboardData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData);
      }, 500);
    });
  }
}

export const financeService = new FinanceService();
