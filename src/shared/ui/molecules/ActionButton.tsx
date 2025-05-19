import { Button } from "@/shared/ui/atoms/Button"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'primaryFilled';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  icon: Icon,
  children,
  variant = 'default',
  onClick,
  disabled,
  className,
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${className}`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Button>
  );
}