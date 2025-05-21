export const badgeVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-input',
  success: 'bg-green-100 text-green-800',
};

export type BadgeVariant = keyof typeof badgeVariants;
