import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import InsightCard from "@/components/InsightCard";
import ChatInterface from "@/components/ChatInterface";
import { insightCards, extendedInsights, InsightCard as InsightCardType } from "@/data/mockData";
import { Lightbulb, MessageSquare } from "lucide-react";

const Insights = () => {
  const location = useLocation();
  const [chatMessage, setChatMessage] = useState<string>("");
  const [allInsights] = useState([...insightCards, ...extendedInsights]);

  useEffect(() => {
    if (location.state?.selectedInsight) {
      const insight: InsightCardType = location.state.selectedInsight;
      setChatMessage(`Tell me more about: ${insight.title} - ${insight.description}`);
    }
  }, [location.state]);

  const handleLearnMore = (insight: InsightCardType) => {
    setChatMessage(`I'd like to learn more about: ${insight.title}. ${insight.description} Can you provide more details and actionable advice?`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Insights & AI Assistant</h1>
          <p className="text-muted-foreground">Discover personalized financial insights and chat with AI for deeper guidance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights Feed */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Your Financial Insights</h2>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {allInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onActionClick={handleLearnMore}
                  actionText="Learn More"
                />
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">AI Financial Assistant</h2>
            </div>
            
            <ChatInterface initialMessage={chatMessage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insights;