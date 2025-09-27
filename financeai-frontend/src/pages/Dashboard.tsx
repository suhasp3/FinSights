import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import InsightCard from "@/components/InsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { totalMonthlySpend, insightCards, InsightCard as InsightCardType } from "@/data/mockData";
import { DollarSign, TrendingUp, Target, CreditCard } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleInsightClick = (insight: InsightCardType) => {
    navigate('/insights', { state: { selectedInsight: insight } });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickStats = [
    {
      title: "Monthly Spend",
      value: formatCurrency(totalMonthlySpend),
      icon: DollarSign,
      description: "Current month total",
      trend: "+8.2%"
    },
    {
      title: "Budget Remaining",
      value: formatCurrency(600),
      icon: Target,
      description: "Until monthly limit",
      trend: "85% used"
    },
    {
      title: "Active Cards",
      value: "3",
      icon: CreditCard,
      description: "Credit & Debit cards",
      trend: "2 primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Get insights into your spending patterns and financial health</p>
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
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.description}</span>
                  <span className="text-primary font-medium">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SpendingChart />
          <CategoryChart />
        </div>

        {/* Insights */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Quick Insights</h2>
            <div className="flex items-center text-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">AI Powered</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {insightCards.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onActionClick={handleInsightClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;