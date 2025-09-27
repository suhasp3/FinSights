import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, User, ArrowRight } from "lucide-react";

const Login = () => {
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // For now, just store the customer ID and navigate to dashboard
      localStorage.setItem("customerId", customerId);
      setIsLoading(false);

      // Dispatch custom event to notify App component of login
      window.dispatchEvent(new CustomEvent("login"));

      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary rounded-lg p-3">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary ml-3">
            FinanceAI
          </span>
        </div>

        {/* Login Card */}
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter your customer ID to access your financial dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="customerId"
                  className="text-sm font-medium text-foreground"
                >
                  Customer ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerId"
                    type="text"
                    placeholder="Enter your customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!customerId.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Log In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo Mode:</strong> Use any customer ID to explore the
                dashboard with sample data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Powered by Capital One Nessie API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
