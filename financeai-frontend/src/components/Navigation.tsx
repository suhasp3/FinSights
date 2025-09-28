import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  MessageCircle,
  BarChart3,
  Target,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("username");
    // Dispatch custom event to notify App component of logout
    window.dispatchEvent(new CustomEvent("logout"));
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/finsightslogo.png"
              alt="FinSights Logo"
              className="h-8 w-8 rounded-md"
            />
            <span className="text-xl font-bold text-primary">FinSights</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/home"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive("/home")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/insights"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive("/insights")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Insights & Chat</span>
            </Link>
            <Link
              to="/budget"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive("/budget")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Target className="h-4 w-4" />
              <span>Budget</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
