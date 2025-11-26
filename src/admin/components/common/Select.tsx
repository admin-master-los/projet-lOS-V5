import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Composant Select réutilisable pour l'admin
 * Supporte label, erreur, et options
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Sélectionnez une option',
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          {/* Select */}
          <select
            ref={ref}
            id={selectId}
            className={`
              block w-full rounded-lg bg-white/5 text-white
              border ${error ? 'border-red-500' : 'border-gray-600'}
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              pl-3 pr-10 py-2.5
              appearance-none
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-400">
            {helperText}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
