
import React, { useState } from "react";
import { Bell, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-finance-primary mr-2" />
          <h1 className="text-xl font-bold text-finance-primary">FraudGuard ML</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-finance-danger animate-pulse-danger" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>You have new alerts</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-finance-primary flex items-center justify-center text-white">
            <span className="text-sm font-medium">JD</span>
          </div>
          {!isMobile && (
            <span className="ml-2 text-sm font-medium">John Doe</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
