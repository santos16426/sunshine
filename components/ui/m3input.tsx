import { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

interface M3InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
}

const M3_THEME = {
  primary: "bg-primary",
  onPrimary: "text-primary-foreground",
  primaryContainer: "bg-primary/10",
  onPrimaryContainer: "text-foreground",
  secondaryContainer: "bg-secondary",
  onSecondaryContainer: "text-secondary-foreground",
  surface: "bg-card",
  surfaceVariant: "bg-muted",
  onSurface: "text-foreground",
  onSurfaceVariant: "text-muted-foreground",
  outline: "border-border",
  error: "bg-destructive/10",
  onError: "text-destructive",
};

export const M3Input = ({ label, icon: Icon, ...props }: M3InputProps) => {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        )}
        <input
          {...props}
          className={`w-full bg-muted border border-border rounded-xl py-3 ${
            Icon ? "pl-11" : "px-4"
          } pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all`}
        />
      </div>
    </div>
  );
};
interface M3CardProps {
  children: React.ReactNode;
  variant: "elevated" | "filled" | "outlined";
  className: string;
}
export const M3Card = ({
  children,
  variant = "elevated",
  className = "",
}: M3CardProps) => {
  const variants = {
    elevated: "bg-card shadow-md shadow-border",
    filled: M3_THEME.surfaceVariant,
    outlined: `bg-transparent border ${M3_THEME.outline}`,
  };
  return (
    <div
      className={`${variants[variant]} rounded-2xl p-6 transition-all ${className}`}
    >
      {children}
    </div>
  );
};

interface M3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "filled" | "tonal" | "outlined" | "text";
  icon?: React.ElementType | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className: string;
  disabled?: boolean;
}
export const M3Button = ({
  children,
  variant = "filled",
  icon: Icon = null,
  onClick,
  className = "",
  disabled = false,
}: M3ButtonProps) => {
  const styles = {
    filled: `${M3_THEME.primary} ${M3_THEME.onPrimary} hover:shadow-lg`,
    tonal: `${M3_THEME.secondaryContainer} ${M3_THEME.onSecondaryContainer} hover:opacity-90`,
    outlined: `border ${M3_THEME.outline} ${M3_THEME.onSurface} hover:bg-muted`,
    text: `${M3_THEME.onPrimaryContainer} hover:bg-muted`,
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${styles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
