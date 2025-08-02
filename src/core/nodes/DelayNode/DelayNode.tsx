import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Timer, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DelayNodeData } from './DelayNode.definition';

interface DelayNodeProps {
  data: DelayNodeData;
  selected?: boolean;
}

/**
 * The React component that renders the Delay node on the canvas.
 */
export const DelayNode = memo(({ data, selected }: DelayNodeProps) => {
  return (
    <div
      className={cn(
        'relative px-3 py-1.5 shadow-md rounded-md bg-card border border-orange-400 min-w-[150px]',
        data.isRunning && !data.error ? 'ring-2 ring-offset-2 ring-orange-500 ring-offset-white' : '',
        data.error ? 'ring-2 ring-offset-2 ring-red-500 ring-offset-white' : '',
        selected && 'border-primary'
      )}
    >
      {data.error && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -top-2 -right-2">
                <AlertTriangle className="h-5 w-5 text-red-500 fill-red-200" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-sans">{data.error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-orange-500" />
        <div>
          <div className="text-xs font-bold text-card-foreground">Delay</div>
          <p className="text-[11px] text-muted-foreground">
            Wait for {data.delay} {data.unit}
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

DelayNode.displayName = 'DelayNode';