export function BrandLogo({
  className,
  alt = 'PURITY',
  variant = 'main',
}: {
  className?: string
  alt?: string
  variant?: 'main' | 'extended'
}) {
  return (
    <img
      src={variant === 'extended' ? '/extended_black.svg' : '/main_black.svg'}
      alt={alt}
      className={className}
    />
  )
}
