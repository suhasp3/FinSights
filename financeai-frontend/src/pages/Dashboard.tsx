import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { RecentTransactions } from "@/components/RecentTransactions";
import { BudgetPlaceholder } from "@/components/BudgetPlaceholder";
import CategoryChart from "@/components/CategoryChart";
import { AIInsights } from "@/components/AIInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, DashboardData } from "@/services/api";
import {
  DollarSign,
  TrendingUp,
  Target,
  CreditCard,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  // Fetch dashboard data from API
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", customerId],
    queryFn: () => apiService.getDashboardData(customerId!),
    enabled: !!customerId,
  });

  // Fetch AI insights
  const {
    data: aiInsightsData,
    isLoading: aiInsightsLoading,
    error: aiInsightsError,
  } = useQuery({
    queryKey: ["ai-insights", customerId],
    queryFn: () => apiService.getAIInsights(customerId!),
    enabled: !!customerId,
  });

  const handleInsightClick = (insight: any) => {
    navigate("/insights", { state: { selectedInsight: insight } });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error Loading Data
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load financial data"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                window.dispatchEvent(new CustomEvent("logout"));
                navigate("/login");
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
            >
              Clear Session & Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Data Available
          </h2>
          <p className="text-muted-foreground">
            Unable to load financial data for this customer.
          </p>
        </div>
      </div>
    );
  }

  // Calculate quick stats from real data
  const totalMonthlySpend = dashboardData.spending_data.total_monthly_spend;
  const accountCount = dashboardData.accounts.length;
  const totalBalance = dashboardData.accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const quickStats = [
    {
      title: "Monthly Spend",
      value: formatCurrency(totalMonthlySpend),
      icon: DollarSign,
      description: "Current month total",
      trend: "+8.2%",
    },
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      icon: Target,
      description: "Across all accounts",
      trend: `${accountCount} accounts`,
    },
    {
      title: "Active Accounts",
      value: accountCount.toString(),
      icon: CreditCard,
      description: "Bank accounts",
      trend: "All active",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground">
            Get insights into your spending patterns and financial health
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.description}</span>
                  <span className="text-primary font-medium">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Transactions and Budget Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentTransactions
            transactions={dashboardData.transactions.map((t) => ({
              id: t._id,
              description: t.description,
              amount: t.amount,
              date: t.transaction_date,
              category: t.merchant?.category || "Other",
              merchant: t.merchant?.name || "Unknown",
            }))}
          />
          <div className="space-y-6">
            <CategoryChart
              data={dashboardData.spending_data.category_spending}
            />
            <BudgetPlaceholder />
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              AI Financial Insights
            </h2>
            <div className="flex items-center text-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Powered by OpenAI</span>
            </div>
          </div>

          <AIInsights 
            insights={aiInsightsData?.insights || []} 
            isLoading={aiInsightsLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
