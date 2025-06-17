import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useNotification } from './useNotification';

interface UseRealtimeSyncOptions {
  table: string;
  onInsert?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  onUpdate?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  onDelete?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  showNotifications?: boolean;
}

export const useRealtimeSync = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  showNotifications = true,
}: UseRealtimeSyncOptions) => {
  const { addNotification } = useNotification();

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`${table} real-time update:`, payload);

          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload);
          } else if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload);
          } else if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete]);

  const handleInsert = (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
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
  };

  const handleUpdate = (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
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
  };

  const handleDelete = (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
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
  };

  return {
    handleInsert,
    handleUpdate,
    handleDelete
  };
};