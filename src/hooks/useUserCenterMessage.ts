import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type MessageSource = 'daily' | 'session_summary' | 'welcome' | 'cached';

interface UserCenterMessageResult {
  message: string | null;
  isLoading: boolean;
  source: MessageSource;
  status: 'idle' | 'generating' | 'error';
}

/**
 * Smart message hook for UserCenter that shows different messages based on navigation context:
 * - From Chat/Video: Show session summary (e.g., "Thanks for the chat")
 * - From Profile: Keep cached message unchanged
 * - Fresh app open: Show daily message
 */
export const useUserCenterMessage = (therapistId?: string | null, therapistName?: string): UserCenterMessageResult => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<MessageSource>('daily');
  const [status, setStatus] = useState<'idle' | 'generating' | 'error'>('idle');

  const normalizedTherapistId = useMemo(() => (therapistId || '').trim(), [therapistId]);

  useEffect(() => {
    let isCancelled = false;

    const determineMessageType = (): 'daily' | 'session_summary' | 'cached' => {
      // Get navigation context from localStorage
      const lastRoute = localStorage.getItem('lastRoute');
      const sessionActive = sessionStorage.getItem('userCenterMessage');
      const fromProfile = lastRoute === '/profile';

      console.log('[useUserCenterMessage] Navigation context:', { lastRoute, sessionActive: !!sessionActive, fromProfile });

      // If returning from profile, keep cached message
      if (fromProfile && sessionActive) {
        return 'cached';
      }

      // If coming from chat or video, generate session summary
      if (lastRoute === '/chat' || lastRoute === '/video-call') {
        return 'session_summary';
      }

      // Fresh app open or first visit - use daily message
      return 'daily';
    };

    const generateSessionSummary = async (sessionType: 'chat' | 'video'): Promise<string | null> => {
      console.log('[useUserCenterMessage] Generating session summary for:', sessionType);
      setStatus('generating');

      try {
        // Get chat context if available
        const chatContext = sessionType === 'chat' ? getChatContext() : null;

        const { data, error } = await supabase.functions.invoke('generate-session-summary', {
          body: {
            therapistName: therapistName || 'Elena',
            sessionType,
            chatContext
          },
        });

        if (error) {
          console.error('[useUserCenterMessage] Session summary error:', error);
          return null;
        }

        const summaryMessage = data?.message;
        console.log('[useUserCenterMessage] Generated summary:', summaryMessage);
        return summaryMessage;
      } catch (error) {
        console.error('[useUserCenterMessage] Session summary exception:', error);
        return null;
      } finally {
        setStatus('idle');
      }
    };

    const getDailyMessage = async (): Promise<string | null> => {
      console.log('[useUserCenterMessage] Getting daily message for therapist:', normalizedTherapistId);
      
      try {
        const { data, error } = await supabase.rpc('pick_and_use_random_daily_message', {
          therapist_id_input: normalizedTherapistId,
        });

        if (error) {
          console.error('[useUserCenterMessage] Daily message RPC error:', error);
          return null;
        }

        const picked = Array.isArray(data) && data.length > 0 ? data[0] : null;
        const text = picked?.message_text ?? null;
        console.log('[useUserCenterMessage] Daily message:', text);
        return text;
      } catch (error) {
        console.error('[useUserCenterMessage] Daily message exception:', error);
        return null;
      }
    };

    const getChatContext = () => {
      try {
        const chatData = localStorage.getItem(`chatData_${normalizedTherapistId}`);
        if (chatData) {
          const parsed = JSON.parse(chatData);
          const recentMessages = parsed.messages?.slice(-3) || [];
          return {
            lastMessages: recentMessages
              .filter((msg: any) => msg.sender === 'user')
              .map((msg: any) => msg.text)
              .join(', ')
          };
        }
      } catch (error) {
        console.warn('[useUserCenterMessage] Failed to get chat context:', error);
      }
      return null;
    };

    const run = async () => {
      if (!normalizedTherapistId) {
        console.log('[useUserCenterMessage] No therapist ID, skipping');
        setMessage(null);
        return;
      }

      setIsLoading(true);
      setStatus('idle');

      try {
        const messageType = determineMessageType();
        console.log('[useUserCenterMessage] Message type determined:', messageType);

        if (messageType === 'cached') {
          // Use cached message from sessionStorage
          const cachedMessage = sessionStorage.getItem('userCenterMessage');
          if (cachedMessage) {
            setMessage(cachedMessage);
            setSource('cached');
            console.log('[useUserCenterMessage] Using cached message:', cachedMessage);
            return;
          }
          // Fallback to daily if no cache
        }

        if (messageType === 'session_summary') {
          // Generate session summary
          const lastRoute = localStorage.getItem('lastRoute');
          const sessionType = lastRoute === '/chat' ? 'chat' : 'video';
          const summaryMessage = await generateSessionSummary(sessionType);
          
          if (summaryMessage && !isCancelled) {
            setMessage(summaryMessage);
            setSource('session_summary');
            // Cache the message for potential return from profile
            sessionStorage.setItem('userCenterMessage', summaryMessage);
            return;
          }
          // Fallback to daily if summary fails
        }

        // Get daily message (default case or fallback)
        const dailyMessage = await getDailyMessage();
        if (!isCancelled) {
          setMessage(dailyMessage);
          setSource('daily');
          // Cache daily message too
          if (dailyMessage) {
            sessionStorage.setItem('userCenterMessage', dailyMessage);
          }
        }

      } catch (error) {
        console.error('[useUserCenterMessage] Unexpected error:', error);
        setStatus('error');
        if (!isCancelled) {
          setMessage(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [normalizedTherapistId, therapistName]);

  return { 
    message, 
    isLoading, 
    source, 
    status 
  };
};

// Navigation tracking utility
export const trackNavigation = (route: string) => {
  localStorage.setItem('lastRoute', route);
  console.log('[Navigation] Tracked route:', route);
};
