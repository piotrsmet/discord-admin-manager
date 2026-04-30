export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-secondary rounded-lg border border-accent/50 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, className = '' }: { title: string; description?: string; className?: string }) {
  return (
    <div className={`p-5 border-b border-accent/50 ${className}`}>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}
