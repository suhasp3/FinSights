import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  merchant: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Dining": "bg-red-100 text-red-800",
      Transportation: "bg-blue-100 text-blue-800",
      Shopping: "bg-purple-100 text-purple-800",
      Entertainment: "bg-yellow-100 text-yellow-800",
      Healthcare: "bg-green-100 text-green-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">
                    {transaction.description}
                  </h4>
                  <Badge
                    className={`text-xs ${getCategoryColor(
                      transaction.category
                    )}`}
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {transaction.merchant} • {formatDate(transaction.date)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold text-sm ${
                    transaction.amount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {transaction.amount < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
          ))}
        </div>
        {transactions.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing 10 of {transactions.length} transactions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
