import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Upload, 
  BarChart3, 
  Users, 
  Settings, 
  FileImage, 
  Activity, 
  Stethoscope,
  Calendar,
  Bell,
  User,
  LogOut 
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

interface User {
  name: string;
  role: string;
  email: string;
}

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children, onLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getRoleMenuItems = (role: string) => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
      { title: "Settings", url: "/settings", icon: Settings },
    ];

    switch (role) {
      case 'radiologist':
        return [
          { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
          { title: "Upload MRI", url: "/upload", icon: Upload },
          { title: "Scan Analysis", url: "/analysis", icon: FileImage },
          { title: "Reports", url: "/reports", icon: Activity },
          { title: "Patient Records", url: "/patients", icon: Users },
          ...baseItems.slice(1)
        ];
      case 'doctor':
        return [
          { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
          { title: "Patient Summaries", url: "/patients", icon: Users },
          { title: "Analysis Results", url: "/results", icon: Activity },
          { title: "Treatment Plans", url: "/treatments", icon: Stethoscope },
          ...baseItems.slice(1)
        ];
      case 'specialist':
        return [
          { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
          { title: "Advanced Analysis", url: "/advanced", icon: Brain },
          { title: "Research Data", url: "/research", icon: FileImage },
          { title: "Comparative Studies", url: "/comparative", icon: Activity },
          { title: "Publications", url: "/publications", icon: Users },
          ...baseItems.slice(1)
        ];
      case 'receptionist':
        return [
          { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
          { title: "Patient Management", url: "/patients", icon: Users },
          { title: "Appointments", url: "/appointments", icon: Calendar },
          { title: "Workflow Monitor", url: "/workflow", icon: Activity },
          ...baseItems.slice(1)
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getRoleMenuItems(user.role);
  
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground";

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'radiologist': return 'bg-blue-500';
      case 'doctor': return 'bg-teal-500';
      case 'specialist': return 'bg-green-500';
      case 'receptionist': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar 
          user={user} 
          menuItems={menuItems} 
          isActive={isActive} 
          getNavCls={getNavCls}
          getRoleColor={getRoleColor}
          onLogout={onLogout}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-lg font-semibold medical-gradient-text">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <Badge className={`${getRoleColor(user.role)} text-white`}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  user: User;
  menuItems: Array<{ title: string; url: string; icon: any }>;
  isActive: (path: string) => boolean;
  getNavCls: ({ isActive }: { isActive: boolean }) => string;
  getRoleColor: (role: string) => string;
  onLogout: () => void;
}

function AppSidebar({ user, menuItems, isActive, getNavCls, getRoleColor, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-card">
        {/* Brand */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-sm medical-gradient-text">NeuroVision</div>
                <div className="text-xs text-muted-foreground">Assist</div>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardLayout;