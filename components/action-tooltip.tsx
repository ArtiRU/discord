'use client';
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '@/components/ui/tooltip';
import { ReactNode, FC } from 'react';

interface ActionTooltipProps {
  side?: 'bottom' | 'right' | 'left' | 'top';
  align?: 'center' | 'start' | 'end';
  children: ReactNode;
  label: string;
}

const ActionTooltip: FC<ActionTooltipProps> = ({
  children,
  label,
  align,
  side,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
