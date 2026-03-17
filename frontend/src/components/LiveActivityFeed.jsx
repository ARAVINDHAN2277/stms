import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Radio, Zap, Trophy, MessageSquare } from 'lucide-react';

const LiveActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            const handleUpdate = (data) => {
                const newActivity = {
                    id: Date.now(),
                    type: 'MATCH',
                    message: `Score Update: ${data.player1Score} - ${data.player2Score}`,
                    time: new Date().toLocaleTimeString(),
                    icon: <Trophy className="w-3 h-3 text-emerald-500" />
                };
                setActivities(prev => [newActivity, ...prev].slice(0, 5));
            };

            const handleAnnouncement = (data) => {
                const newActivity = {
                    id: Date.now(),
                    type: 'ANNOUNCEMENT',
                    message: data.message,
                    time: new Date().toLocaleTimeString(),
                    icon: <Radio className="w-3 h-3 text-blue-500" />
                };
                setActivities(prev => [newActivity, ...prev].slice(0, 5));
            };

            socket.on('match_update', handleUpdate);
            socket.on('new_announcement', handleAnnouncement);

            return () => {
                socket.off('match_update', handleUpdate);
                socket.off('new_announcement', handleAnnouncement);
            };
        }
    }, [socket]);

    if (activities.length === 0) {
        return (
            <div className="glass p-6 rounded-sm text-center">
                <Zap className="w-8 h-8 text-gray-700 mx-auto mb-3 opacity-20" />
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Awaiting Live Signals...</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-sm p-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3 mb-6">
                <ActivityIcon className="w-5 h-5 text-emerald-500" /> Global Feed
            </h2>
            <div className="space-y-4">
                {activities.map(activity => (
                    <div key={activity.id} className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-sm animate-slide-in">
                        <div className="mt-1">{activity.icon}</div>
                        <div>
                            <p className="text-white text-xs font-medium leading-relaxed">{activity.message}</p>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default LiveActivityFeed;
