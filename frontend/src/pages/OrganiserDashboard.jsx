import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, DollarSign, Activity, ChevronRight, Clock } from "lucide-react";
import AuthContext from "../context/AuthContext.jsx";
import axios from "axios";

const StatCard = ({ icon, title, value, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-heading font-bold text-navy-dark">{value}</h3>
      </div>
      <div className="p-3 bg-warm-surface rounded-xl text-primary">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-text-muted">{subtitle}</span>
      {trend && <span className="text-green-500 font-medium">{trend}</span>}
    </div>
  </div>
);

const OrganiserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    activeTournaments: 0,
    totalPlayers: 0,
    revenue: 0,
    pendingApprovals: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // In a real scenario, this would fetch an aggregated stats endpoint
    // For now, we mock some premium dashboard data to establish the UI structure
    setStats({
      activeTournaments: 3,
      totalPlayers: 142,
      revenue: 4500,
      pendingApprovals: 12
    });

    setRecentActivity([
      { id: 1, action: "Registration Pending", details: "John Doe registered for Summer Smash", time: "2 hours ago" },
      { id: 2, action: "Match Completed", details: "Team Alpha won against Team Beta (2-1)", time: "5 hours ago" },
      { id: 3, action: "Tournament Live", details: "Winter Cup 2026 is now live", time: "1 day ago" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Trophy size={24} />} 
          title="Active Tournaments" 
          value={stats.activeTournaments} 
          subtitle="2 scheduled soon" 
        />
        <StatCard 
          icon={<Users size={24} />} 
          title="Total Players" 
          value={stats.totalPlayers} 
          subtitle="Across all tournaments" 
          trend="+12% this month"
        />
        <StatCard 
          icon={<DollarSign size={24} />} 
          title="Revenue" 
          value={`$${stats.revenue}`} 
          subtitle="Total entry fees collected" 
        />
        <StatCard 
          icon={<Activity size={24} />} 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          subtitle="Requires attention" 
          trend="Action Needed"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-warm-border shadow-sm p-6">
          <h3 className="text-lg font-heading font-bold text-navy-dark mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/organise-tournament"
              className="w-full flex items-center justify-between p-4 rounded-xl bg-warm-surface hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                <span className="font-medium text-navy-dark group-hover:text-primary">Create Tournament</span>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary" />
            </Link>
            
            <Link 
              to="/organiser/tournaments"
              className="w-full flex items-center justify-between p-4 rounded-xl bg-warm-surface hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                <span className="font-medium text-navy-dark group-hover:text-primary">Manage Brackets</span>
              </div>
              <ChevronRight size={18} className="text-text-muted group-hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-warm-border shadow-sm p-6">
          <h3 className="text-lg font-heading font-bold text-navy-dark mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 rounded-xl border border-warm-surface hover:border-warm-border transition-colors">
                <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-navy-dark">{activity.action}</h4>
                  <p className="text-sm text-text-muted mt-1">{activity.details}</p>
                </div>
                <div className="text-sm text-text-muted whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
