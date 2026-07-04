import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: ReactNode;
  hint?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      leftIcon,
      hint,
      showPasswordToggle = false,
      type,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const inputType = showPasswordToggle
      ? showPassword ? 'text' : 'password'
      : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {hint && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500 -mt-1">
            {hint}
          </p>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-describedby={hint ? `${inputId}-hint` : error ? `${inputId}-error` : undefined}
            aria-invalid={error ? 'true' : 'false'}
            className={`
              input-field
              ${leftIcon ? 'pl-10' : ''}
              ${showPasswordToggle ? 'pr-11' : ''}
              ${error ? 'input-error' : ''}
              ${success && !error ? 'input-success' : ''}
              ${className}
            `}
            {...props}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-slash icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                // Eye icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1 mt-0.5"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
