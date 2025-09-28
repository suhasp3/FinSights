import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import ChatInterface from "@/components/ChatInterface";
import { AIInsight, apiService } from "@/services/api";
import { Lightbulb, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Target, MessageCircle } from "lucide-react";

const Insights = () => {
  const location = useLocation();
  const [chatMessage, setChatMessage] = useState<string>("");
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(
    null
  );

  // Get username from localStorage
  const username = localStorage.getItem("username");

  // Get budget data from localStorage
  const getBudgets = () => {
    const budgets = localStorage.getItem("budgets");
    return budgets ? JSON.parse(budgets) : null;
  };
  const budgets = getBudgets();

  // Calculate actual spending from transactions to match AI insights
  const calculateSpendingFromTransactions = (transactions: any[]) => {
    const spending = {
      transportation: 0,
      foodDining: 0,
      healthcare: 0,
      entertainment: 0,
      shopping: 0,
    };

    transactions.forEach((txn) => {
      if (txn.amount < 0) {
        // Only count expenses
        const amount = Math.abs(txn.amount);
        const category = txn.merchant?.category || "Other";

        switch (category) {
          case "Food & Dining":
            spending.foodDining += amount;
            break;
          case "Transportation":
            spending.transportation += amount;
            break;
          case "Healthcare":
            spending.healthcare += amount;
            break;
          case "Entertainment":
            spending.entertainment += amount;
            break;
          case "Shopping":
            spending.shopping += amount;
            break;
        }
      }
    });

    return spending;
  };

  // Fetch dashboard data first to get transactions
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard", username],
    queryFn: () => apiService.getDashboardData(username!),
    enabled: !!username,
  });

  // Fetch AI insights
  const {
    data: aiInsightsData,
    isLoading: aiInsightsLoading,
    error: aiInsightsError,
  } = useQuery({
    queryKey: ["ai-insights", username, budgets],
    queryFn: () => {
      // Convert budget data to the format expected by the backend
      const budgetData: { [key: string]: number } = {};
      if (budgets) {
        budgetData.transportation = budgets.transportation || 0;
        budgetData.foodDining = budgets.foodDining || 0;
        budgetData.healthcare = budgets.healthcare || 0;
        budgetData.entertainment = budgets.entertainment || 0;
        budgetData.shopping = budgets.shopping || 0;
      }
      return apiService.getAIInsights(username!, budgetData);
    },
    enabled: !!username && !!dashboardData,
  });

  useEffect(() => {
    if (location.state?.selectedInsight) {
      const insight: AIInsight = location.state.selectedInsight;
      setSelectedInsight(insight);
      setChatMessage(
        `Tell me more about: ${insight.title} - ${insight.description}`
      );
    }
  }, [location.state]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "food & dining":
        return <DollarSign className="h-4 w-4" />;
      case "transportation":
        return <TrendingUp className="h-4 w-4" />;
      case "entertainment":
        return <Target className="h-4 w-4" />;
      case "shopping":
        return <Target className="h-4 w-4" />;
      case "healthcare":
        return <Target className="h-4 w-4" />;
      case "savings":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Dining": "bg-red-100 text-red-800 border-red-200",
      Transportation: "bg-blue-100 text-blue-800 border-blue-200",
      Entertainment: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Shopping: "bg-purple-100 text-purple-800 border-purple-200",
      Healthcare: "bg-green-100 text-green-800 border-green-200",
      Savings: "bg-emerald-100 text-emerald-800 border-emerald-200",
      General: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleLearnMore = (insight: AIInsight) => {
    setSelectedInsight(insight);
    // Clear the chat message when using insight prop to avoid double responses
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Insights & AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Discover personalized financial insights and chat with AI for deeper
            guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights Feed */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Your Financial Insights
              </h2>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {aiInsightsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">
                    Loading AI insights...
                  </p>
                </div>
              ) : aiInsightsError ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Failed to load insights. Please try again.
                  </p>
                </div>
              ) : aiInsightsData?.insights &&
                aiInsightsData.insights.length > 0 ? (
                aiInsightsData.insights.map((insight, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(insight.category)}
                        <h3 className="font-semibold text-sm">
                          {insight.title}
                        </h3>
                      </div>
                      <Badge
                        className={`text-xs ${getCategoryColor(
                          insight.category
                        )}`}
                      >
                        {insight.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      {insight.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-500">
                        Amount: {insight.amount}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLearnMore(insight)}
                        className="text-xs"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                      <p className="text-xs text-blue-800">
                        Tip: {insight.tip}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No insights available. Check back later for personalized
                    financial advice.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                AI Financial Assistant
              </h2>
            </div>

            <ChatInterface
              initialMessage={selectedInsight ? "" : chatMessage}
              insight={selectedInsight}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insights;
