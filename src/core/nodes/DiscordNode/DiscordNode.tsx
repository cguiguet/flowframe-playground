import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DiscordNodeData } from './DiscordNode.definition';

/**
 * Props for the DiscordNode component.
 */
interface DiscordNodeProps {
  data: DiscordNodeData;
  selected?: boolean;
}

/**
 * The React component that renders the DiscordNode on the canvas.
 */
export const DiscordNode = memo(({ data, selected }: DiscordNodeProps) => {
  return (
    <div
      className={cn(
        'relative px-3 py-1.5 shadow-md rounded-md bg-card border border-indigo-500 min-w-[150px]', // Discord-like color
        data.isRunning && !data.error ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-white' : '',
        data.error ? 'ring-2 ring-offset-2 ring-red-500 ring-offset-white' : '',
        selected && 'border-blue-500'
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

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-indigo-500" />
        <div>
          <div className="text-xs font-bold text-card-foreground">Discord</div>
          <div className="text-[11px] text-muted-foreground">{data.label}</div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

DiscordNode.displayName = 'DiscordNode';