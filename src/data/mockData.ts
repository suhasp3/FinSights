// Mock financial data for the app

export interface SpendingData {
  month: string;
  amount: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
  icon: string;
}

export const monthlySpending: SpendingData[] = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 3500 },
  { month: "Apr", amount: 2900 },
  { month: "May", amount: 3300 },
  { month: "Jun", amount: 2600 },
  { month: "Jul", amount: 3800 },
  { month: "Aug", amount: 3100 },
  { month: "Sep", amount: 2700 },
  { month: "Oct", amount: 3400 },
  { month: "Nov", amount: 2900 },
  { month: "Dec", amount: 3600 },
];

export const categorySpending: CategoryData[] = [
  { category: "Food & Dining", amount: 1200, color: "hsl(var(--chart-food))" },
  { category: "Transportation", amount: 800, color: "hsl(var(--chart-transport))" },
  { category: "Shopping", amount: 650, color: "hsl(var(--chart-shopping))" },
  { category: "Entertainment", amount: 400, color: "hsl(var(--chart-entertainment))" },
  { category: "Other", amount: 350, color: "hsl(var(--chart-other))" },
];

export const totalMonthlySpend = 3400;

export const insightCards: InsightCard[] = [
  {
    id: "1",
    title: "Dining Spend Up 22%",
    description: "Your restaurant spending increased significantly this month. Consider meal prep to save.",
    type: "negative",
    icon: "utensils"
  },
  {
    id: "2",
    title: "Shopping Down 10%",
    description: "Great job reducing your shopping expenses! You saved $75 compared to last month.",
    type: "positive",
    icon: "shopping-bag"
  },
  {
    id: "3",
    title: "Budget Goal: 85% Complete",
    description: "You're on track to meet your monthly budget goal with 5 days remaining.",
    type: "positive",
    icon: "target"
  },
  {
    id: "4",
    title: "Transportation Costs Stable",
    description: "Your commute costs remain consistent. Consider carpooling for additional savings.",
    type: "neutral",
    icon: "car"
  }
];

export const extendedInsights: InsightCard[] = [
  {
    id: "5",
    title: "Coffee Budget Alert",
    description: "You've spent $120 on coffee this month. That's $40 over your usual average.",
    type: "negative",
    icon: "coffee"
  },
  {
    id: "6", 
    title: "Subscription Optimization",
    description: "You saved $50 this week by canceling unused subscriptions. Well done!",
    type: "positive",
    icon: "credit-card"
  },
  {
    id: "7",
    title: "Weekend Spending Pattern",
    description: "You tend to spend 40% more on weekends. Consider setting weekend budgets.",
    type: "neutral",
    icon: "calendar"
  },
  {
    id: "8",
    title: "Emergency Fund Progress",
    description: "You're 60% towards your emergency fund goal. Keep up the great work!",
    type: "positive",
    icon: "shield"
  }
];