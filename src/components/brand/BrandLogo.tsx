export function BrandLogo({
  className,
  alt = 'PURITY',
  variant = 'main',
}: {
  className?: string
  alt?: string
  variant?: 'main' | 'extended'
}) {
  const isExtended = variant === 'extended'

  return (
    <img
      src={isExtended ? '/extended_black.svg' : '/main_black.svg'}
      alt={alt}
      width={352.8}
      height={isExtended ? 180 : 140.4}
      className={className}
    />
  )
}
