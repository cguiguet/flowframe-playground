import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessNodeData } from './ProcessNode.definition';

/**
 * The props for the ProcessNode component, now using the strongly-typed data interface.
 */
interface ProcessNodeProps {
  data: ProcessNodeData;
  selected?: boolean;
}

/**
 * The React component that renders the ProcessNode on the canvas.
 * It is wrapped in `memo` for performance optimization.
 */
export const ProcessNode = memo(({ data, selected }: ProcessNodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-secondary border-2 border-border min-w-[150px]",
      selected && "border-primary" // Highlight if selected
    )}>
      {/* Input handle: where connections arrive */}
      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />
      
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-secondary-foreground" />
        <div className="text-sm font-medium text-secondary-foreground">
          {data.label}
        </div>
      </div>
      
      {/* Output handle: where connections originate */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';