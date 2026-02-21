"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PatientEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

export function PatientEmptyState({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
}: PatientEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16">
      <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mb-8">
        {description}
      </p>
      <Button onClick={onButtonClick} className="gap-2">
        <Plus className="w-4 h-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
