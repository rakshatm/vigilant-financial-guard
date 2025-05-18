
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  TrendingUp, 
  BarChart,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { open } = useSidebar();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Transactions", path: "/transactions", icon: <Activity className="h-5 w-5" /> },
    { name: "Anomalies", path: "/anomalies", icon: <BarChart className="h-5 w-5" /> },
    { name: "Trends", path: "/trends", icon: <TrendingUp className="h-5 w-5" /> },
    { name: "Model", path: "/model", icon: <BarChart className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <ShadcnSidebar
      className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      variant="sidebar"
      collapsible="icon"
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {open && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-finance-primary" />
            <span className="font-bold text-lg text-finance-primary">FraudGuard ML</span>
          </div>
        )}
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </div>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  tooltip={item.name}
                  asChild
                  isActive={location.pathname === item.path}
                >
                  <Link to={item.path} className={cn(
                    "flex items-center gap-3",
                    location.pathname === item.path ? "font-medium" : ""
                  )}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
