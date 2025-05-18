
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  Activity, 
  Menu, 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Transactions", path: "/transactions", icon: <Activity className="h-5 w-5" /> },
    { name: "Anomalies", path: "/anomalies", icon: <BarChart className="h-5 w-5" /> },
    { name: "Trends", path: "/trends", icon: <TrendingUp className="h-5 w-5" /> },
    { name: "Model", path: "/model", icon: <BarChart className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Desktop sidebar
  const desktopSidebar = (
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 fixed z-10",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4">
        {isExpanded && <span className="text-lg font-bold">FraudGuard ML</span>}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-gray-800"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !isExpanded && "rotate-180")} />
        </Button>
      </div>
      
      <div className="flex-1 py-4">
        <nav>
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isExpanded && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
  
  // Mobile sidebar toggle button
  const mobileMenuButton = (
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleMobileSidebar} 
        className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-900 text-white shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
  
  // Mobile sidebar
  const mobileSidebar = (
    <div className={cn(
      "md:hidden fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform z-40",
      isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">FraudGuard ML</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMobileSidebar} 
            className="text-white hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="py-4">
        <nav>
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
  
  // Overlay for mobile sidebar
  const mobileOverlay = (
    <div 
      className={cn(
        "md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity",
        isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setIsMobileSidebarOpen(false)}
    />
  );
  
  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
      {mobileOverlay}
      {mobileMenuButton}
    </>
  );
};

export default Sidebar;
