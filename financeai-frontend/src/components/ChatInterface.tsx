import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage?: string;
}

const ChatInterface = ({ initialMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your personal finance AI assistant. I can help you understand your spending patterns, create budgets, and answer questions about your finances. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const simulateAIResponse = (userMessage: string): string => {
    const responses = {
      coffee: "Based on your spending data, you've spent $120 on coffee this month, which is $40 over your usual $80 average. I recommend setting a weekly coffee budget of $20 to stay on track. You could also try making coffee at home 2-3 days per week to save around $15-20 weekly.",
      save: "Great question! Based on your current spending patterns, here are 3 ways to save $200 in 3 months: 1) Reduce dining out by $70/month (cook 2 more meals at home weekly), 2) Cancel unused subscriptions worth $30/month, 3) Use public transport instead of rideshare 8 times per month to save $100/month.",
      budget: "I'd be happy to help you create a budget! Based on your spending history, I recommend the 50/30/20 rule: 50% for needs ($1,700), 30% for wants ($1,020), and 20% for savings ($680). Your current spending suggests you're spending about 15% more on wants. Would you like me to create a detailed monthly budget plan?",
      default: "I understand you're asking about your finances. Could you be more specific? I can help with budgeting, spending analysis, savings goals, or answer questions about specific categories like dining, transportation, or entertainment expenses."
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("coffee")) return responses.coffee;
    if (lowerMessage.includes("save") && lowerMessage.includes("200")) return responses.save;
    if (lowerMessage.includes("budget")) return responses.budget;
    return responses.default;
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b">
        <div className="bg-primary rounded-full p-2">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Finance AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Online and ready to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[80%] space-x-2",
                message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "rounded-full p-2 flex-shrink-0",
                  message.sender === "user" 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {message.sender === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
              </div>
              <Card
                className={cn(
                  "p-3 max-w-full",
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted/50 text-foreground"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </Card>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="bg-muted text-muted-foreground rounded-full p-2">
                <Bot className="h-3 w-3" />
              </div>
              <Card className="bg-muted/50 p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your spending, budgets, or financial goals..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;