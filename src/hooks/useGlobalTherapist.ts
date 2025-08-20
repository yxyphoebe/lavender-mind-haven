import { useTherapistContext } from '@/contexts/TherapistContext';

// Hook to use either the context or the original hook for backwards compatibility
export const useGlobalTherapist = () => {
  try {
    return useTherapistContext();
  } catch (error) {
    // Fallback to original hook if context is not available
    console.warn('TherapistContext not available, using fallback');
    throw error;
  }
};