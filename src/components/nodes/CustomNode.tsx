import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface CustomNodeProps {
  data: {
    label: string;
    type: string;
  };
  selected?: boolean;
}

const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-card border-2 border-border min-w-[150px]",
      selected && "border-primary"
    )}>
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      
      <div className="text-center">
        <div className="text-xs text-muted-foreground">{data.type}</div>
        <div className="text-sm font-medium text-card-foreground">{data.label}</div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;