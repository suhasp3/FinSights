import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BudgetData {
  transportation: number;
  foodDining: number;
  healthcare: number;
  entertainment: number;
  shopping: number;
}

interface SpendingData {
  transportation: number;
  foodDining: number;
  healthcare: number;
  entertainment: number;
  shopping: number;
}

interface BudgetProgressProps {
  budgets: BudgetData;
  spending: SpendingData;
}

export function BudgetProgress({ budgets, spending }: BudgetProgressProps) {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-800"; // Dark red
    if (percentage >= 80) return "bg-red-500"; // Red
    if (percentage >= 60) return "bg-yellow-500"; // Yellow
    if (percentage >= 40) return "bg-green-300"; // Light green
    if (percentage >= 30) return "bg-green-500"; // Green
    return "bg-green-200"; // Light green for < 30%
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <TrendingDown className="h-4 w-4 text-red-800" />;
    if (percentage >= 80) return <TrendingDown className="h-4 w-4 text-red-500" />;
    if (percentage >= 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    if (percentage >= 40) return <TrendingUp className="h-4 w-4 text-green-300" />;
    if (percentage >= 30) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingUp className="h-4 w-4 text-green-200" />;
  };

  const budgetCategories = [
    { key: "transportation" as keyof BudgetData, label: "Transportation", color: "bg-blue-500" },
    { key: "foodDining" as keyof BudgetData, label: "Food & Dining", color: "bg-red-500" },
    { key: "healthcare" as keyof BudgetData, label: "Healthcare", color: "bg-green-500" },
    { key: "entertainment" as keyof BudgetData, label: "Entertainment", color: "bg-purple-500" },
    { key: "shopping" as keyof BudgetData, label: "Shopping", color: "bg-orange-500" },
  ];

  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = Object.values(spending).reduce((sum, spent) => sum + spent, 0);
  const overallProgress = getProgressPercentage(totalSpent, totalBudget);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Budget Progress</CardTitle>
          <Button 
            size="sm"
            onClick={() => navigate("/budget")}
            className="bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            Modify
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{overallProgress.toFixed(1)}% of budget used</span>
            {getStatusIcon(overallProgress)}
          </div>
        </div>

        {/* Category Progress */}
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const budget = budgets[category.key];
            const spent = spending[category.key];
            const percentage = getProgressPercentage(spent, budget);
            
            if (budget === 0) return null;

            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(spent)} / {formatCurrency(budget)}
                    </span>
                    {getStatusIcon(percentage)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>
                    {spent > budget 
                      ? `Over by ${formatCurrency(spent - budget)}`
                      : `${formatCurrency(budget - spent)} remaining`
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t">
          <Button 
            className="w-full bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            onClick={() => navigate("/budget")}
          >
            <Target className="h-4 w-4 mr-2" />
            Manage Budgets
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
