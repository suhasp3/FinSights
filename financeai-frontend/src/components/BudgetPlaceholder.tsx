import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BudgetPlaceholder() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Set Up Your Budget
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Create monthly spending limits for each category to help manage your finances and track your progress.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-sm">Monthly Budgets</p>
                <p className="text-xs text-gray-600">Set limits by category</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-sm">Progress Tracking</p>
                <p className="text-xs text-gray-600">
                  Visual progress bars for each category
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-sm">Smart Insights</p>
                <p className="text-xs text-gray-600">AI-powered savings tips</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate("/budget")}
            className="w-full"
          >
            <Target className="h-4 w-4 mr-2" />
            Set Up Budget
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
