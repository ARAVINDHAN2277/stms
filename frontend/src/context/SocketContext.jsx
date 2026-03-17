import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
            autoConnect: true
        });

        setSocket(newSocket);

        newSocket.on('match_update', (data) => {
            toast.success(`Score Update: ${data.player1Score} - ${data.player2Score}`, {
                icon: '🏆',
                duration: 4000
            });
        });

        newSocket.on('new_announcement', (data) => {
            toast(data.message, {
                icon: '📢',
                duration: 6000
            });
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.emit('join_private', user.id);
            console.log(`Socket joining private room for user: ${user.id}`);
        }
    }, [socket, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
