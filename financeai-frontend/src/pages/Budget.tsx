import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Target, TrendingUp, Car, Utensils, Heart, Gamepad2, ShoppingBag } from "lucide-react";

interface BudgetForm {
  transportation: string;
  foodDining: string;
  healthcare: string;
  entertainment: string;
  shopping: string;
}

const Budget = () => {
  // Check if budgets already exist
  const existingBudgets = localStorage.getItem("budgets");
  const parsedBudgets = existingBudgets ? JSON.parse(existingBudgets) : null;
  
  const [budgets, setBudgets] = useState<BudgetForm>({
    transportation: parsedBudgets?.transportation?.toString() || "",
    foodDining: parsedBudgets?.foodDining?.toString() || "",
    healthcare: parsedBudgets?.healthcare?.toString() || "",
    entertainment: parsedBudgets?.entertainment?.toString() || "",
    shopping: parsedBudgets?.shopping?.toString() || "",
  });
  const [isSetupComplete, setIsSetupComplete] = useState(!!parsedBudgets);

  const budgetCategories = [
    {
      key: "transportation" as keyof BudgetForm,
      label: "Transportation",
      icon: Car,
      description: "Gas, rideshare, public transit, car maintenance",
      placeholder: "500",
    },
    {
      key: "foodDining" as keyof BudgetForm,
      label: "Food & Dining",
      icon: Utensils,
      description: "Groceries, restaurants, coffee, takeout",
      placeholder: "800",
    },
    {
      key: "healthcare" as keyof BudgetForm,
      label: "Healthcare",
      icon: Heart,
      description: "Medical bills, prescriptions, insurance",
      placeholder: "300",
    },
    {
      key: "entertainment" as keyof BudgetForm,
      label: "Entertainment",
      icon: Gamepad2,
      description: "Movies, streaming, games, hobbies",
      placeholder: "200",
    },
    {
      key: "shopping" as keyof BudgetForm,
      label: "Shopping",
      icon: ShoppingBag,
      description: "Clothing, electronics, household items",
      placeholder: "400",
    },
  ];

  const handleInputChange = (key: keyof BudgetForm, value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    setBudgets(prev => ({
      ...prev,
      [key]: numericValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save budgets to localStorage
    const budgetData = {
      transportation: parseFloat(budgets.transportation) || 0,
      foodDining: parseFloat(budgets.foodDining) || 0,
      healthcare: parseFloat(budgets.healthcare) || 0,
      entertainment: parseFloat(budgets.entertainment) || 0,
      shopping: parseFloat(budgets.shopping) || 0,
    };
    
    localStorage.setItem("budgets", JSON.stringify(budgetData));
    setIsSetupComplete(true);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "$0" : new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Budget Management
            </h1>
            <p className="text-muted-foreground">
              Track your spending against your budget goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetCategories.map((category) => {
              const Icon = category.icon;
              const budgetAmount = budgets[category.key];
              const formattedAmount = formatCurrency(budgetAmount);
              
              return (
                <Card key={category.key} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {category.label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {formattedAmount}
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Monthly Budget</span>
                      <span className="text-primary font-medium">Set</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => setIsSetupComplete(false)}
              className="w-full max-w-md bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              Modify Budgets
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Set Up Your Budget
          </h1>
          <p className="text-muted-foreground">
            Create monthly spending limits for each category to help manage your finances
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Budget Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {budgetCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.key} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <Label htmlFor={category.key} className="text-sm font-medium">
                        {category.label}
                      </Label>
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={category.key}
                        type="text"
                        placeholder={category.placeholder}
                        value={budgets[category.key]}
                        onChange={(e) => handleInputChange(category.key, e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                );
              })}

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Set Up Budget
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Budget;
