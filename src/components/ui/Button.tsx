import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_8px_20px_rgb(230_158_38/0.32)] hover:bg-brand-700 hover:shadow-[0_10px_26px_rgb(230_158_38/0.4)]',
  secondary:
    'bg-white text-ink ring-1 ring-line hover:ring-brand-300 hover:bg-brand-50',
  ghost: 'bg-transparent text-ink hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
