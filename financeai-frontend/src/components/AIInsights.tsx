import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Lightbulb } from "lucide-react";
import { AIInsight } from "@/services/api";
import { Loader2 } from "lucide-react";

interface AIInsightsProps {
  insights: AIInsight[];
  isLoading: boolean;
}

export function AIInsights({ insights, isLoading }: AIInsightsProps) {
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

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating AI insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" /> AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">Welcome to AI Insights!</h3>
                </div>
                <Badge className={`text-xs ${getCategoryColor("General")}`}>
                  General
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                AI-powered financial insights are being generated for your spending patterns.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Amount: Coming Soon
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <p className="text-xs text-blue-800">
                  Tip: Check back soon for personalized financial advice based on your spending habits.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
                <Badge
                  className={`text-xs ${getCategoryColor(insight.category)}`}
                >
                  {insight.category}
                </Badge>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {insight.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Amount: {insight.amount}
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <p className="text-xs text-blue-800">
                  Tip: {insight.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
