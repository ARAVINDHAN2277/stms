import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, Wallet, Activity, ChevronRight, Clock } from "lucide-react";
import AuthContext from "../context/AuthContext.jsx";
import axios from "axios";

const StatCard = ({ icon, title, value, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-warm-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
    {/* Abstract background accent */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-text-muted text-sm font-bold mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-heading font-bold text-navy-dark tracking-tight">{value}</h3>
      </div>
      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl text-primary border border-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <div className="mt-6 flex items-center justify-between text-sm relative z-10">
      <span className="text-text-muted font-medium">{subtitle}</span>
      {trend && (
        <span className={`font-bold px-2 py-1 rounded-md ${trend.includes('Caught') ? 'bg-warm-surface text-text-muted' : trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
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
        const res = await axios.get(`/api/tournaments/organiser`, {
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
        <div className="bg-white rounded-3xl border border-warm-border/50 shadow-sm overflow-hidden flex flex-col relative group">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <div className="p-6 border-b border-warm-border/50 bg-gradient-to-r from-warm-surface to-transparent">
            <h3 className="text-xl font-heading font-black text-navy-dark">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-3 relative z-10 flex-1">
            <Link 
              to="/organise-tournament"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-warm-surface/50 border border-warm-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group/link"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl text-primary shadow-sm group-hover/link:scale-110 transition-transform duration-300">
                  <Trophy size={20} />
                </div>
                <span className="font-bold text-navy-dark group-hover/link:text-primary transition-colors">Create Tournament</span>
              </div>
              <ChevronRight size={20} className="text-text-muted group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
            </Link>
            
            <Link 
              to="/organiser/tournaments"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-warm-surface/50 border border-warm-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group/link"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl text-primary shadow-sm group-hover/link:scale-110 transition-transform duration-300">
                  <Activity size={20} />
                </div>
                <span className="font-bold text-navy-dark group-hover/link:text-primary transition-colors">Manage Brackets</span>
              </div>
              <ChevronRight size={20} className="text-text-muted group-hover/link:text-primary group-hover/link:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-warm-border/50 shadow-sm overflow-hidden relative group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all duration-500"></div>
          <div className="p-6 border-b border-warm-border/50 bg-gradient-to-r from-warm-surface to-transparent flex justify-between items-center">
            <h3 className="text-xl font-heading font-black text-navy-dark">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4 relative z-10">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-4 rounded-2xl border border-warm-surface hover:border-warm-border/80 hover:shadow-sm bg-white transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-navy-dark">{activity.action}</h4>
                  <p className="text-sm text-text-muted mt-1 font-medium">{activity.details}</p>
                </div>
                <div className="text-xs font-bold text-text-muted/70 bg-warm-surface px-3 py-1 rounded-lg h-fit">
                  {activity.time}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-warm-surface/30 rounded-2xl border border-dashed border-warm-border">
                <Activity size={40} className="mx-auto text-warm-border mb-3" />
                <p className="text-text-muted font-medium">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganiserDashboard;
