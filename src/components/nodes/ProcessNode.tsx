import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProcessNodeProps {
  data: {
    label: string;
    config?: any;
  };
  selected?: boolean;
}

const ProcessNode = memo(({ data, selected }: ProcessNodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-secondary border-2 border-border min-w-[150px]",
      selected && "border-primary"
    )}>
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-secondary-foreground" />
        <div className="text-sm font-medium text-secondary-foreground">{data.label}</div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';

export default ProcessNode;