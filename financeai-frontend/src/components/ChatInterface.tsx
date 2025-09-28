import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage?: string;
  insight?: {
    title: string;
    description: string;
    category: string;
    amount: string;
    tip: string;
  };
}

const ChatInterface = ({ initialMessage, insight }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your personal finance AI assistant. I can help you understand your spending patterns, create budgets, and answer questions about your finances. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [processedInsight, setProcessedInsight] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Prioritize insight over initial message to avoid double responses
    if (insight && insight.title !== processedInsight) {
      setProcessedInsight(insight.title);
      handleInsightMessage(insight);
    } else if (initialMessage && initialMessage.trim()) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, insight, processedInsight]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        return "Please log in to use the AI assistant.";
      }

      // Convert messages to history format (exclude the initial greeting and current message)
      const history = messages
        .filter((msg) => msg.id !== "1" && msg.sender !== "user") // Exclude initial greeting and current user message
        .slice(-8) // Keep last 8 messages to avoid token limits
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await apiService.sendChatMessage(
        userMessage,
        username,
        history
      );
      return response.response;
    } catch (error) {
      console.error("AI response error:", error);
      return "I'm having trouble connecting to my AI assistant right now. Please try again in a moment, or feel free to ask about your spending patterns, budgeting tips, or any financial questions you have!";
    }
  };

  const handleInsightMessage = async (insight: any) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        return;
      }

      // Add user message first
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `Tell me more about: ${insight.title} - ${insight.description}`,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Show typing indicator
      setIsTyping(true);

      // Convert messages to history format (exclude the initial greeting and current message)
      const history = messages
        .filter((msg) => msg.id !== "1" && msg.sender !== "user") // Exclude initial greeting and current user message
        .slice(-8) // Keep last 8 messages to avoid token limits
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await apiService.getInsightDetails(
        insight,
        username,
        history
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Insight details error:", error);
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: `Here's more about your ${insight.category} insight: ${insight.description}. ${insight.tip}`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
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

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponseText = await getAIResponse(content);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting to my AI assistant right now. Please try again in a moment!",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b">
        <div className="bg-primary rounded-full p-2">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Finance AI Assistant
          </h3>
          <p className="text-xs text-muted-foreground">
            Online and ready to help
          </p>
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
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : "flex-row"
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
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/^(\d+)\.\s/gm, "<strong>$1.</strong> ")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
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
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
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
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
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
