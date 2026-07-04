import { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthInfo {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
}

const getPasswordStrength = (password: string): StrengthInfo => {
  if (!password) return { score: 0, label: '', color: '', bgColor: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  const levels: StrengthInfo[] = [
    { score: 0, label: '', color: '', bgColor: '' },
    { score: 1, label: 'Weak', color: 'text-red-400', bgColor: 'bg-red-500' },
    { score: 2, label: 'Fair', color: 'text-orange-400', bgColor: 'bg-orange-500' },
    { score: 3, label: 'Good', color: 'text-yellow-400', bgColor: 'bg-yellow-500' },
    { score: 4, label: 'Strong', color: 'text-green-400', bgColor: 'bg-green-500' },
  ];

  return levels[score]!;
};

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {/* Strength bars */}
      <div className="flex gap-1.5" role="meter" aria-label={`Password strength: ${strength.label}`} aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              level <= strength.score ? strength.bgColor : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Label + requirements */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <RequirementBadge met={password.length >= 8} text="8+ chars" />
          <RequirementBadge met={/[A-Z]/.test(password)} text="Uppercase" />
          <RequirementBadge met={/[0-9]/.test(password)} text="Number" />
          <RequirementBadge met={/[\W_]/.test(password)} text="Symbol" />
        </div>
        {strength.label && (
          <span className={`text-xs font-semibold ${strength.color}`}>
            {strength.label}
          </span>
        )}
      </div>
    </div>
  );
};

const RequirementBadge = ({ met, text }: { met: boolean; text: string }) => (
  <span className={`text-[10px] flex items-center gap-0.5 transition-colors duration-200 ${met ? 'text-green-400' : 'text-gray-600'}`}>
    {met ? (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )}
    {text}
  </span>
);

export default PasswordStrength;
