

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard,
  Network, 
  FileText, 
  Users, 
  Hospital,
  UploadCloud,
  ClipboardCheck,
  Bell,
  Settings,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  BarChart3,
  Heart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const navigationItems = [
  {
    title: "Services Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Bird's-eye view of services performance"
  },
  {
    title: "PG Dashboard New",
    url: createPageUrl("PGDashboardNew"),
    icon: Building2,
    description: "Integrated Physician Group Dashboard with Services"
  },
  {
    title: "PG Reporting",
    url: createPageUrl("PGReporting"),
    icon: BarChart3,
    description: "PG Performance Analysis & Patient Validation"
  },
  {
    title: "Customer Success",
    url: createPageUrl("CustomerSuccessDashboard"),
    icon: Heart,
    description: "Comprehensive Customer Success Metrics & Health Tracking"
  },
  {
    title: "Network Analysis", 
    url: createPageUrl("NetworkAnalysis"),
    icon: Network,
    description: "Provider-HHA Relationships"
  },
  {
    title: "Document Ingestion",
    url: createPageUrl("DocumentIngestion"),
    icon: UploadCloud,
    description: "AI-Powered Document Processing"
  },
  {
    title: "Patient Management",
    url: createPageUrl("PatientManagement"),
    icon: Users,
    description: "Comprehensive Patient Records"
  },
  {
    title: "Resolution Center",
    url: createPageUrl("ResolutionCenter"),
    icon: ClipboardCheck,
    description: "Task & Issue Management"
  }
];

const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "New Document Needs Processing",
    message: "Referral document for John Smith requires review",
    time: "5 min ago",
    unread: true
  },
  {
    id: 2,
    type: "success",
    title: "Patient Processed Successfully",
    message: "Maria Garcia validated and ready for billing",
    time: "15 min ago",
    unread: true
  },
  {
    id: 3,
    type: "warning",
    title: "Missing Documents Alert",
    message: "Robert Johnson missing F2F and 485 forms",
    time: "1 hour ago",
    unread: false
  },
  {
    id: 4,
    type: "info",
    title: "Network Analysis Updated",
    message: "New PG-HHA connections identified",
    time: "2 hours ago",
    unread: false
  }
];

const NotificationIcon = ({ type }) => {
  const icons = {
    alert: AlertTriangle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Clock
  };
  const colors = {
    alert: "text-red-500",
    success: "text-green-500", 
    warning: "text-orange-500",
    info: "text-blue-500"
  };
  
  const Icon = icons[type];
  return <Icon className={`w-4 h-4 ${colors[type]}`} />;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoProcessing: false,
    darkMode: false,
    soundAlerts: true
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const QuickActionsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("DocumentIngestion")} className="flex items-center">
            <UploadCloud className="w-4 h-4 mr-2" />
            Process New Document
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" className="flex items-center">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Services Command Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("PGDashboardNew")} className="flex items-center">
            <Hospital className="w-4 h-4 mr-2" />
            View Services Operations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("ResolutionCenter")} className="flex items-center">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Manage Tasks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("PatientManagement")} className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Patient Records
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("NetworkAnalysis")} className="flex items-center">
            <Network className="w-4 h-4 mr-2" />
            Analyze Network
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("PGReporting")} className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            PG Reporting Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NotificationsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4 text-slate-400" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 hover:bg-slate-50 border-b last:border-b-0 ${
                notification.unread ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <NotificationIcon type={notification.type} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${notification.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SettingsDialog = () => (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4 text-slate-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Platform Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">Notifications</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
              <Switch 
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => toggleSetting('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-alerts" className="text-sm">Sound Alerts</Label>
              <Switch 
                id="sound-alerts"
                checked={settings.soundAlerts}
                onCheckedChange={() => toggleSetting('soundAlerts')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">Processing</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-processing" className="text-sm">Auto-Processing</Label>
              <Switch 
                id="auto-processing"
                checked={settings.autoProcessing}
                onCheckedChange={() => toggleSetting('autoProcessing')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">Appearance</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
              <Switch 
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => toggleSetting('darkMode')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">System Info</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Version: 3.0.0</p>
              <p>Last Updated: Dec 2024</p>
              <p>Status: All systems operational</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <Sidebar className="border-r border-slate-200/60 bg-white/90 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PF</span>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm font-semibold text-slate-800">Patient Flow Management</p>
              <p className="text-xs text-slate-500">Healthcare Platform</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Core Modules
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.url} 
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <item.icon className={`w-5 h-5 shrink-0 transition-colors ${
                              isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{item.title}</div>
                              <div className={`text-xs truncate ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                {item.description}
                              </div>
                            </div>
                            {item.title === "Document Ingestion" && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs animate-pulse">
                                ACTIVE
                              </Badge>
                            )}
                            {item.title === "Resolution Center" && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                8
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                System Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-4">
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-800 font-medium">Processing Pipeline</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">All systems operational</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Active Patients</span>
                      <span className="font-semibold text-indigo-600">1,247</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Processing Queue</span>
                      <span className="font-semibold text-orange-600">28</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Success Rate</span>
                      <span className="font-semibold text-green-600">98.5%</span>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">DoctorAlliance</p>
                <p className="text-xs text-slate-500 truncate">Healthcare Operations</p>
              </div>
              <div className="flex gap-1">
                <NotificationsMenu />
                <SettingsDialog />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">DoctorAlliance Platform</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {React.cloneElement(children, { QuickActionsMenu })}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

