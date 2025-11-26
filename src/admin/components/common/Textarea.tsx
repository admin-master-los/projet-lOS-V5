import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Composant Textarea réutilisable pour l'admin
 * Supporte label, erreur, compteur de caractères
 */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      className = '',
      id,
      required,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = value?.toString().length || 0;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            block w-full rounded-lg bg-white/5 text-white placeholder-gray-500
            border ${error ? 'border-red-500' : 'border-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            px-3 py-2.5
            resize-vertical
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />

        {/* Footer: Helper text + Char count */}
        <div className="mt-1.5 flex items-center justify-between">
          {/* Helper text */}
          {helperText && !error && (
            <p id={`${textareaId}-helper`} className="text-sm text-gray-400">
              {helperText}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p
              id={`${textareaId}-error`}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          {/* Character count */}
          {showCharCount && maxLength && (
            <p
              className={`text-sm ml-auto ${
                currentLength > maxLength * 0.9
                  ? 'text-yellow-400'
                  : 'text-gray-500'
              }`}
            >
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
