import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, DollarSign } from "lucide-react";

export function BudgetPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget Management</CardTitle>
          <Badge variant="outline" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Smart Budget Planning
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Set spending limits, track progress, and get personalized
            recommendations to help you stay on budget.
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
                <p className="font-medium text-sm">Spending Alerts</p>
                <p className="text-xs text-gray-600">
                  Get notified when approaching limits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-sm">Smart Recommendations</p>
                <p className="text-xs text-gray-600">AI-powered savings tips</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            This feature will be available in a future update
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
