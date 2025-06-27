
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SessionMemory = Tables<'session_memories'>;

export const useSessionMemories = (userId?: string) => {
  const [memories, setMemories] = useState<SessionMemory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchMemories();
    }
  }, [userId]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('session_memories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMemory = async (sessionId: string, memoryData: {
    memory_type: string;
    title: string;
    content: string;
    keywords?: string[];
    emotional_tone?: string;
    importance_score?: number;
  }) => {
    try {
      if (!userId) return;

      const { data, error } = await supabase
        .from('session_memories')
        .insert({
          session_id: sessionId,
          user_id: userId,
          ...memoryData
        })
        .select()
        .single();

      if (error) throw error;
      setMemories(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  };

  return {
    memories,
    loading,
    createMemory,
    refetch: fetchMemories
  };
};
