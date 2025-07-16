import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordRequirement {
  test: (password: string) => boolean;
  label: string;
}

const requirements: PasswordRequirement[] = [
  { test: (pwd) => pwd.length >= 8, label: 'At least 8 characters' },
  { test: (pwd) => /[A-Z]/.test(pwd), label: 'Contains uppercase letter' },
  { test: (pwd) => /[a-z]/.test(pwd), label: 'Contains lowercase letter' },
  { test: (pwd) => /\d/.test(pwd), label: 'Contains number' },
  { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: 'Contains special character' },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { strength, score, passedRequirements } = useMemo(() => {
    const passed = requirements.filter(req => req.test(password));
    const score = (passed.length / requirements.length) * 100;
    
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    if (score >= 80) strength = 'strong';
    else if (score >= 60) strength = 'good';
    else if (score >= 40) strength = 'fair';

    return { strength, score, passedRequirements: passed };
  }, [password]);

  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return 'bg-destructive';
      case 'fair': return 'bg-mindful-400';
      case 'good': return 'bg-enso-400';
      case 'strong': return 'bg-mindful-500';
      default: return 'bg-neutral-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
    }
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Password Strength:</span>
        <span className={`text-sm font-medium ${
          strength === 'strong' ? 'text-mindful-600' :
          strength === 'good' ? 'text-enso-600' :
          strength === 'fair' ? 'text-mindful-500' : 'text-destructive'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <Progress value={score} className="h-2">
        <div className={`h-full transition-all duration-300 rounded-full ${getStrengthColor()}`} style={{ width: `${score}%` }} />
      </Progress>
      
      <div className="space-y-1">
        {requirements.map((req, index) => {
          const isPassed = req.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isPassed ? (
                <Check className="w-3 h-3 text-mindful-500" />
              ) : (
                <X className="w-3 h-3 text-neutral-400" />
              )}
              <span className={`text-xs ${isPassed ? 'text-mindful-600' : 'text-neutral-500'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}