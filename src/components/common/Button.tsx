import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 6,
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  border: '1px solid transparent',
  outline: 'none',
  whiteSpace: 'nowrap',
};

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#0a0c10',
    borderColor: 'var(--accent)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    borderColor: 'transparent',
  },
  danger: {
    background: 'var(--danger-dim)',
    color: 'var(--danger)',
    borderColor: 'var(--danger)40',
  },
  success: {
    background: 'var(--success-dim)',
    color: 'var(--success)',
    borderColor: 'var(--success)40',
  },
};

const SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: 30, padding: '0 10px', fontSize: 12 },
  md: { height: 38, padding: '0 16px', fontSize: 13 },
  lg: { height: 46, padding: '0 22px', fontSize: 15 },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...rest}
      disabled={isDisabled}
      style={{
        ...BASE,
        ...VARIANTS[variant],
        ...SIZES[size],
        ...(fullWidth ? { width: '100%' } : {}),
        ...(isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...style,
      }}
    >
      {loading ? (
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
