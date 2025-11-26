import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Composant Button réutilisable pour l'admin
 * Supporte différents variants, tailles et états
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105',
  secondary:
    'bg-white/5 border border-gray-600 text-gray-300 hover:bg-white/10 hover:border-cyan-500/50 hover:text-white',
  danger:
    'bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500',
  success:
    'bg-green-500/10 border border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-500',
  ghost:
    'text-gray-400 hover:text-cyan-400 hover:bg-white/5',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

    const widthStyles = fullWidth ? 'w-full' : '';

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader size={16} className="animate-spin" />
            <span>Chargement...</span>
          </>
        ) : (
          <>
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
