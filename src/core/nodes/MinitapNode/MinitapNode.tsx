import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Terminal, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MinitapNodeData } from './MinitapNode.definition';

interface MinitapNodeProps {
  data: MinitapNodeData;
  selected?: boolean;
}

export const MinitapNode: React.FC<MinitapNodeProps> = memo(({ data, selected }) => {
  return (
    <div
      className={cn(
        'relative px-3 py-1.5 shadow-md rounded-md bg-card border border-blue-400 min-w-[150px]',
        data.isRunning && !data.error ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-white' : '',
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

      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-blue-500" />
        <div>
          <div className="text-xs font-bold text-card-foreground">Minitap</div>
          <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">
            {data.action || 'No action set'}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

MinitapNode.displayName = 'MinitapNode';
