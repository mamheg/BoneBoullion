import type { Product } from '@/types'
import { JarIllustration } from './JarIllustration'

/**
 * Renders the real product photo when available, otherwise falls back to the
 * jar illustration (SKUs still awaiting photography).
 */
export function ProductImage({
  product,
  className = '',
  jarClassName = 'p-6',
}: {
  product: Product
  className?: string
  jarClassName?: string
}) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`size-full object-cover ${className}`}
      />
    )
  }
  return (
    <JarIllustration
      accent={product.accent}
      title={product.name}
      className={`size-full ${jarClassName} ${className}`}
    />
  )
}
