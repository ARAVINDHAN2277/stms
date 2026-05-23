import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Swords, Activity, Settings, CheckCircle, XCircle } from "lucide-react";

const TournamentManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for UI demonstration
  const tournament = { name: "Summer Smash 2026", status: "REGISTRATION_OPEN", registrations: 24, sport: "Tennis" };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={18} /> },
    { id: "participants", label: "Participants", icon: <Users size={18} /> },
    { id: "matches", label: "Matches", icon: <Swords size={18} /> },
    { id: "scoring", label: "Scoring", icon: <CheckCircle size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/organiser/tournaments" className="p-2 bg-white rounded-full border border-warm-border hover:bg-warm-surface transition-colors">
          <ArrowLeft size={20} className="text-navy-dark" />
        </Link>
        <div>
          <h2 className="text-2xl font-heading font-bold text-navy-dark">{tournament.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">
              {tournament.status.replace("_", " ")}
            </span>
            <span className="text-sm text-text-muted">{tournament.sport}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-warm-border mb-6 no-scrollbar pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-navy-dark hover:border-warm-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="bg-white rounded-2xl border border-warm-border shadow-sm min-h-[400px]">
        {activeTab === "overview" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-4">Tournament Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Total Registrations</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">{tournament.registrations}</p>
              </div>
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Matches Scheduled</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">0</p>
              </div>
              <div className="p-4 bg-warm-surface rounded-xl border border-warm-border">
                <p className="text-sm text-text-muted">Revenue Generated</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">$480</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div className="p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-navy-dark">Manage Participants</h3>
            </div>
            
            {/* Mock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warm-border text-sm text-text-muted">
                    <th className="py-3 px-4 font-medium">Player</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Payment</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-navy-dark">
                  <tr className="border-b border-warm-surface hover:bg-warm-bg/50 transition-colors">
                    <td className="py-4 px-4 font-medium">Alex Chen</td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">PENDING</span></td>
                    <td className="py-4 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">PAID</span></td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button className="text-green-600 hover:text-green-800"><CheckCircle size={18} /></button>
                      <button className="text-red-500 hover:text-red-700"><XCircle size={18} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-navy-dark">Schedule & Logistics</h3>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover shadow-md transition-colors">
                Generate Schedule
              </button>
            </div>
            <div className="text-center py-12">
              <Swords className="mx-auto text-warm-border mb-3" size={48} />
              <p className="text-text-muted">No matches scheduled yet. Close registration to generate bracket.</p>
            </div>
          </div>
        )}

        {activeTab === "scoring" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-6">Live Match Scoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mock Match Card */}
              <div className="p-5 border border-warm-border rounded-xl bg-warm-surface flex flex-col gap-4">
                <div className="flex justify-between text-sm text-text-muted font-medium">
                  <span>Round 1</span>
                  <span>Court A</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center w-1/3">
                    <p className="font-bold text-navy-dark mb-2">Team Alpha</p>
                    <input type="number" placeholder="0" className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" />
                  </div>
                  <div className="font-bold text-text-muted">VS</div>
                  <div className="text-center w-1/3">
                    <p className="font-bold text-navy-dark mb-2">Team Beta</p>
                    <input type="number" placeholder="0" className="w-16 text-center p-2 rounded border focus:ring-2 focus:ring-primary outline-none font-bold text-lg bg-white" />
                  </div>
                </div>
                <button className="w-full mt-2 py-2 bg-navy-dark text-white rounded-lg font-medium hover:bg-navy-surface transition-colors">
                  Save Score
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-navy-dark mb-6">Tournament Settings</h3>
            <div className="max-w-md space-y-4">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-warm-border font-medium hover:border-primary hover:text-primary transition-colors">
                Close Registration
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-warm-border font-medium text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors">
                Cancel Tournament
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentManagement;
