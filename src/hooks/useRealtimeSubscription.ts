import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  onInsert?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  onUpdate?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  onDelete?: (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => void;
  enabled?: boolean;
}

export const useRealtimeSubscription = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeSubscriptionOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

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
      .subscribe((status) => {
        console.log(`${table} subscription status:`, status);
        setConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setConnected(false);
      }
    };
  }, [table, enabled, onInsert, onUpdate, onDelete]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setConnected(false);
    }
  }, []);

  return { connected, disconnect };
};