interface BadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function Badge({ difficulty }: BadgeProps) {
  return (
    <span className={`badge badge-${difficulty}`}>
      {difficulty}
    </span>
  );
}
