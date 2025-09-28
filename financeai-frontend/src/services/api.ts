// API service for communicating with the backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export interface Customer {
  _id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  address: {
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
  };
  created_date: string;
}

export interface Account {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number: string;
  customer_id: string;
}

export interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  transaction_date: string;
  status: string;
  account_id: string;
  merchant_id?: string;
  merchant?: {
    _id: string;
    name: string;
    category?: string;
  };
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  color: string;
}

export interface SpendingData {
  monthly_spending: MonthlySpending[];
  daily_spending: DailySpending[];
  category_spending: CategorySpending[];
  recent_transactions: RecentTransaction[];
  total_monthly_spend: number;
}

export interface DailySpending {
  day: string;
  amount: number;
}

export interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  merchant: string;
}

export interface AIInsight {
  title: string;
  description: string;
  category: string;
  amount: string;
  tip: string;
}

export interface DashboardData {
  customer: Customer;
  accounts: Account[];
  transactions: Transaction[];
  spending_data: SpendingData;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Get customer information
  async getCustomer(customerId: string): Promise<Customer> {
    return this.request<Customer>(`/customer?customerId=${customerId}`);
  }

  // Get customer accounts
  async getAccounts(customerId: string): Promise<{ accounts: Account[] }> {
    return this.request<{ accounts: Account[] }>(
      `/accounts?customerId=${customerId}`
    );
  }

  // Get all transactions for customer
  async getTransactions(
    customerId: string
  ): Promise<{ transactions: Transaction[] }> {
    return this.request<{ transactions: Transaction[] }>(
      `/transactions?customerId=${customerId}`
    );
  }

  // Get complete dashboard data
  async getDashboardData(customerId: string): Promise<DashboardData> {
    return this.request<DashboardData>(`/dashboard?customerId=${customerId}`);
  }

  // Get AI insights
  async getAIInsights(
    customerId: string,
    budgetData?: { [key: string]: number }
  ): Promise<{ insights: AIInsight[] }> {
    return this.request<{ insights: AIInsight[] }>("/ai-insights", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        budgetData: budgetData || {},
      }),
    });
  }

  // Chat with AI assistant
  async sendChatMessage(
    message: string,
    username: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<{ response: string }> {
    return this.request<{ response: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, username, history }),
    });
  }

  // Get insight details from chatbot
  async getInsightDetails(
    insight: AIInsight,
    username: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<{ response: string }> {
    return this.request<{ response: string }>("/chat/insight", {
      method: "POST",
      body: JSON.stringify({ insight, username, history }),
    });
  }
}

export const apiService = new ApiService();
