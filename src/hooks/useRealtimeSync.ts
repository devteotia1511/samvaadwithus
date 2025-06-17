import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useNotification } from './useNotification';

interface RealtimeSyncOptions {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
  showNotifications?: boolean;
}

export const useRealtimeSync = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  showNotifications = true
}: RealtimeSyncOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const { addNotification } = useNotification();
  const [connected, setConnected] = useState(false);

  const handleInsert = useCallback((payload: any) => {
    console.log(`Real-time INSERT on ${table}:`, payload);
    onInsert?.(payload);
    
    if (showNotifications) {
      addNotification({
        type: 'success',
        title: 'Data Updated',
        message: `New ${table.slice(0, -1)} added successfully.`,
        duration: 3000
      });
    }
  }, [table, onInsert, showNotifications, addNotification]);

  const handleUpdate = useCallback((payload: any) => {
    console.log(`Real-time UPDATE on ${table}:`, payload);
    onUpdate?.(payload);
    
    if (showNotifications) {
      addNotification({
        type: 'info',
        title: 'Data Updated',
        message: `${table.slice(0, -1)} updated successfully.`,
        duration: 3000
      });
    }
  }, [table, onUpdate, showNotifications, addNotification]);

  const handleDelete = useCallback((payload: any) => {
    console.log(`Real-time DELETE on ${table}:`, payload);
    onDelete?.(payload);
    
    if (showNotifications) {
      addNotification({
        type: 'warning',
        title: 'Data Updated',
        message: `${table.slice(0, -1)} removed successfully.`,
        duration: 3000
      });
    }
  }, [table, onDelete, showNotifications, addNotification]);

  useEffect(() => {
    if (!enabled) return;

    // Create channel with unique name
    const channelName = `${table}_realtime_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: table,
        },
        handleInsert
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: table,
        },
        handleUpdate
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: table,
        },
        handleDelete
      )
      .subscribe((status) => {
        console.log(`Real-time subscription status for ${table}:`, status);
        if (status === 'SUBSCRIBED') {
          setConnected(true);
        }
      });

    channelRef.current = channel;
    setConnected(false);

    return () => {
      if (channelRef.current) {
        console.log(`Unsubscribing from ${table} real-time updates`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setConnected(false);
      }
    };
  }, [table, enabled, handleInsert, handleUpdate, handleDelete]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setConnected(false);
    }
  }, []);

  return {
    isConnected: connected,
    disconnect
  };
};