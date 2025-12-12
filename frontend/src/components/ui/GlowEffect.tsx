interface GlowEffectProps {
  className?: string;
  color?: 'purple' | 'blue' | 'mixed';
  intensity?: 'low' | 'medium' | 'high';
}

export function GlowEffect({
  className = '',
  color = 'purple',
  intensity = 'medium'
}: GlowEffectProps) {
  const colors = {
    purple: 'rgba(139, 92, 246, VAR)',
    blue: 'rgba(59, 130, 246, VAR)',
    mixed: 'rgba(99, 102, 241, VAR)',
  };

  const intensities = {
    low: 0.1,
    medium: 0.15,
    high: 0.2,
  };

  const bgColor = colors[color].replace('VAR', String(intensities[intensity]));

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${bgColor} 0%, transparent 60%)`,
      }}
    />
  );
}
