import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Timer } from 'lucide-react';
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
    <div className={cn(
      "px-3 py-1.5 shadow-md rounded-md bg-card border border-orange-400 min-w-[150px]",
      data.isRunning ? 'ring-2 ring-offset-2 ring-orange-500 ring-offset-white' : '',
      selected && "border-primary"
    )}>
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