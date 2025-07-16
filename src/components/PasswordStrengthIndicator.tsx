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
  { test: (pwd) => pwd.length >= 8, label: '至少8位字符' },
  { test: (pwd) => /[A-Z]/.test(pwd), label: '包含大写字母' },
  { test: (pwd) => /[a-z]/.test(pwd), label: '包含小写字母' },
  { test: (pwd) => /\d/.test(pwd), label: '包含数字' },
  { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: '包含特殊字符' },
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
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-yellow-500';
      case 'good': return 'bg-blue-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak': return '弱';
      case 'fair': return '一般';
      case 'good': return '良好';
      case 'strong': return '强';
    }
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">密码强度:</span>
        <span className={`text-sm font-medium ${
          strength === 'strong' ? 'text-green-600' :
          strength === 'good' ? 'text-blue-600' :
          strength === 'fair' ? 'text-yellow-600' : 'text-red-600'
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
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span className={`text-xs ${isPassed ? 'text-green-600' : 'text-gray-500'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}