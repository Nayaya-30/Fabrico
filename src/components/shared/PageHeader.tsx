'use client'

import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  description?: string
  gradient?: string
}

export function PageHeader({
  badge,
  title,
  subtitle,
  description,
  gradient = 'from-primary-600 via-primary-500 to-accent-500',
}: PageHeaderProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      className={cn(
        'relative py-32 overflow-hidden bg-gradient-to-br',
        gradient
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-300" />
      </div>

      {/* Geometric Decorations */}
      <div className="absolute top-20 right-20 hidden lg:block">
        <div className="w-20 h-20 border-4 border-gold-400/30 rounded-2xl rotate-12 animate-pulse-slow" />
      </div>
      <div className="absolute bottom-32 left-20 hidden lg:block">
        <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-pulse-slow delay-300" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          {badge && (
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 font-semibold text-sm',
                inView && 'animate-fade-in-up'
              )}
            >
              {badge}
            </div>
          )}

          {/* Title */}
          <h1
            className={cn(
              'text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight',
              inView && 'animate-fade-in-up delay-100'
            )}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div
              className={cn(
                'text-2xl md:text-3xl text-gold-400 font-semibold mb-6',
                inView && 'animate-fade-in-up delay-200'
              )}
            >
              {subtitle}
            </div>
          )}

          {/* Description */}
          {description && (
            <p
              className={cn(
                'text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto',
                inView && 'animate-fade-in-up delay-300'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}