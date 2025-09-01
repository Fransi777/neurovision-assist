import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Activity, 
  Users, 
  FileImage, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';

interface DashboardStatsProps {
  userRole: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole }) => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      const baseStats = getStatsForRole(userRole);
      // Add some randomization to simulate real-time data
      const updatedStats = baseStats.map(stat => ({
        ...stat,
        value: stat.title.includes('Time') ? stat.value : 
               Math.floor(parseInt(stat.value) + (Math.random() - 0.5) * 4).toString(),
        change: stat.title.includes('Time') ? stat.change :
                `${Math.random() > 0.5 ? '+' : ''}${Math.floor(Math.random() * 10)}`
      }));
      setStats(updatedStats);
      setLoading(false);
    };

    // Initial load
    updateStats();

    // Set up real-time updates every 10 seconds
    const interval = setInterval(updateStats, 10000);

    // Set up real-time subscriptions for user activity
    const channel = supabase
      .channel('dashboard-updates')
      .on('presence', { event: 'sync' }, () => {
        console.log('Dashboard presence synced');
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [userRole]);
  const getStatsForRole = (role: string) => {
    switch (role) {
      case 'radiologist':
        return [
          {
            title: "Scans Analyzed Today",
            value: "24",
            change: "+12%",
            icon: FileImage,
            color: "dashboard-stat-primary"
          },
          {
            title: "Tumors Detected",
            value: "7",
            change: "+3",
            icon: Brain,
            color: "dashboard-stat-warning"
          },
          {
            title: "Reports Generated",
            value: "18",
            change: "+5",
            icon: Activity,
            color: "dashboard-stat-success"
          },
          {
            title: "Avg. Processing Time",
            value: "28s",
            change: "-2s",
            icon: Clock,
            color: "dashboard-stat-secondary"
          }
        ];
      
      case 'doctor':
        return [
          {
            title: "Active Patients",
            value: "156",
            change: "+8",
            icon: Users,
            color: "dashboard-stat-primary"
          },
          {
            title: "Pending Reviews",
            value: "12",
            change: "-3",
            icon: Activity,
            color: "dashboard-stat-warning"
          },
          {
            title: "Completed Cases",
            value: "89",
            change: "+15",
            icon: CheckCircle,
            color: "dashboard-stat-success"
          },
          {
            title: "Critical Cases",
            value: "3",
            change: "0",
            icon: AlertTriangle,
            color: "dashboard-stat-danger"
          }
        ];
      
      case 'specialist':
        return [
          {
            title: "Research Cases",
            value: "45",
            change: "+7",
            icon: Brain,
            color: "dashboard-stat-primary"
          },
          {
            title: "Publications",
            value: "8",
            change: "+2",
            icon: Activity,
            color: "dashboard-stat-secondary"
          },
          {
            title: "Collaborations",
            value: "23",
            change: "+5",
            icon: Users,
            color: "dashboard-stat-success"
          },
          {
            title: "Data Analysis",
            value: "127",
            change: "+18",
            icon: TrendingUp,
            color: "dashboard-stat-warning"
          }
        ];
      
      case 'receptionist':
        return [
          {
            title: "Today's Appointments",
            value: "32",
            change: "+6",
            icon: Users,
            color: "dashboard-stat-primary"
          },
          {
            title: "Pending Scans",
            value: "8",
            change: "-2",
            icon: FileImage,
            color: "dashboard-stat-warning"
          },
          {
            title: "Completed Today",
            value: "24",
            change: "+4",
            icon: CheckCircle,
            color: "dashboard-stat-success"
          },
          {
            title: "Queue Status",
            value: "Low",
            change: "Optimal",
            icon: Activity,
            color: "dashboard-stat-secondary"
          }
        ];
      
      default:
        return [];
    }
  };

  const stats = getStatsForRole(userRole);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map((i) => (
          <Card key={i} className="medical-card animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-32 h-4 bg-muted rounded"></div>
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-16 h-8 bg-muted rounded"></div>
                <div className="w-24 h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="medical-card transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`dashboard-stat ${stat.color} p-2 rounded-lg transition-all duration-300`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold transition-all duration-300">{stat.value}</div>
              <div className="flex items-center space-x-1">
                <Badge 
                  variant={stat.change.startsWith('+') ? 'default' : 'secondary'} 
                  className="text-xs transition-all duration-300"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last update</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;