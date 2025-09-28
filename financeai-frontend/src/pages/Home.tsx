import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Target,
  DollarSign,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const title = "FinSights";
  const subtitle = "Your AI-Powered Financial Companion";

  useEffect(() => {
    const typeWriter = () => {
      if (currentIndex < title.length) {
        setDisplayText(title.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setTimeout(() => setShowSubtitle(true), 500);
        setTimeout(() => setShowButton(true), 1000);
      }
    };

    const timer = setTimeout(typeWriter, 150);
    return () => clearTimeout(timer);
  }, [currentIndex, title.length]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Animated Title */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Subtitle with fade-in animation */}
          {showSubtitle && (
            <div className="animate-fade-in">
              <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Feature highlights */}
        {showSubtitle && (
          <div className="animate-fade-in-delay mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Smart Budgeting</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium">AI Insights</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-sm font-medium">Track Spending</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {showButton && (
          <div className="animate-fade-in-delay-2">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
