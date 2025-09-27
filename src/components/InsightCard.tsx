import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { InsightCard as InsightCardType } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  insight: InsightCardType;
  onActionClick?: (insight: InsightCardType) => void;
  actionText?: string;
}

const InsightCard = ({ insight, onActionClick, actionText = "Ask in Chat" }: InsightCardProps) => {
  const getIcon = () => {
    switch (insight.type) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBorderColor = () => {
    switch (insight.type) {
      case "positive":
        return "border-l-success";
      case "negative":
        return "border-l-destructive";
      default:
        return "border-l-muted";
    }
  };

  return (
    <Card className={cn("transition-all hover:shadow-lg border-l-4", getBorderColor())}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4">
          {insight.description}
        </CardDescription>
        {onActionClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActionClick(insight)}
            className="w-full group"
          >
            <span>{actionText}</span>
            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;