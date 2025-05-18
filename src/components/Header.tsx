
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
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-finance-primary mr-2" />
            <h1 className="text-xl font-bold text-finance-primary">FraudGuard ML</h1>
          </Link>
          
          {!isMobile && (
            <NavigationMenu className="ml-8">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/transactions" className={navigationMenuTriggerStyle()}>
                    Transactions
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/anomalies" className={navigationMenuTriggerStyle()}>
                    Anomalies
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/trends" className={navigationMenuTriggerStyle()}>
                    Trends
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/model" className={navigationMenuTriggerStyle()}>
                    Model
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/settings" className={navigationMenuTriggerStyle()}>
                    Settings
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
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
      </div>
      
      {isMobile && isSidebarOpen && (
        <div className="mt-3 pb-3">
          <nav className="flex flex-col space-y-1">
            <Link to="/" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/transactions" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Transactions
            </Link>
            <Link to="/anomalies" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Anomalies
            </Link>
            <Link to="/trends" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Trends
            </Link>
            <Link to="/model" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Model Explorer
            </Link>
            <Link to="/settings" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
