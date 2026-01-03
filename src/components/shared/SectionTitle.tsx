import { cn } from '@/lib/utils'

interface SectionTitleProps {
  badge?: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionTitle({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-16', className)}>
      {badge && (
        <div className={cn('inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4 font-semibold text-sm', centered ? 'mx-auto' : '')}>
          {badge}
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-xl text-gray-600 leading-relaxed', centered && 'max-w-3xl mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}