import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, Wallet, Activity, ChevronRight, Clock } from "lucide-react";
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
      {trend && (
        <span className={`font-medium ${trend.includes('Caught') ? 'text-text-muted' : trend.includes('+') ? 'text-green-500' : 'text-primary'}`}>
          {trend}
        </span>
      )}
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/tournaments/organiser/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const tournaments = res.data;
        
        // Calculate Stats
        const active = tournaments.filter(t => t.status === "REGISTRATION_OPEN" || t.status === "LIVE").length;
        const players = tournaments.reduce((acc, t) => acc + (t.registrations?.length || 0), 0);
        const revenue = tournaments.reduce((acc, t) => acc + ((t.registrations?.length || 0) * (t.registrationFee || 0)), 0);
        const pending = tournaments.reduce((acc, t) => acc + (t.registrations?.filter(r => r.status === "PENDING").length || 0), 0);
        
        setStats({
          activeTournaments: active,
          totalPlayers: players,
          revenue: revenue,
          pendingApprovals: pending
        });

        // Generate Recent Activity from newest registrations (simplified)
        const allRegistrations = [];
        tournaments.forEach(t => {
          if (t.registrations) {
            t.registrations.forEach(r => {
              allRegistrations.push({
                id: r.id,
                action: "New Registration",
                details: `A player registered for ${t.tournamentName}`,
                time: "Recently" // Real implementation would use createdAt
              });
            });
          }
        });
        
        // Take top 3
        setRecentActivity(allRegistrations.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-text-muted">Loading your dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Trophy size={24} />} 
          title="Active Tournaments" 
          value={stats.activeTournaments} 
          subtitle={stats.activeTournaments === 1 ? "1 currently running" : `${stats.activeTournaments} currently running`}
        />
        <StatCard 
          icon={<Users size={24} />} 
          title="Total Players" 
          value={stats.totalPlayers} 
          subtitle="Across all tournaments" 
        />
        <StatCard 
          icon={<Wallet size={24} />} 
          title="Revenue" 
          value={`₹${stats.revenue}`} 
          subtitle="Total entry fees collected" 
        />
        <StatCard 
          icon={<Activity size={24} />} 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          subtitle={stats.pendingApprovals > 0 ? "Requires attention" : "All caught up"} 
          trend={stats.pendingApprovals > 0 ? "Action Needed" : ""}
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
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
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
            )) : (
              <div className="text-center py-6">
                <p className="text-text-muted">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
