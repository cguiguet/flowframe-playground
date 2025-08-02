import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { PlayCircle } from 'lucide-react'; // Icône suggestive
import { cn } from '@/lib/utils';
import { StartNodeData } from './StartNode.definition';

/**
 * Props pour le composant StartNode.
 */
interface StartNodeProps {
  data: StartNodeData;
  selected?: boolean;
}

/**
 * Le composant React qui affiche le StartNode sur le canevas.
 */
export const StartNode = memo(({ data, selected }: StartNodeProps) => {
  return (
    <div className={cn(
      "px-3 py-1.5 shadow-md rounded-md bg-card border border-green-500 w-[150px]",
      data.isRunning ? 'ring-2 ring-offset-2 ring-green-500 ring-offset-white' : '',
      selected && "border-blue-500"
    )}>
      {/* Pas de poignée <Handle type="target"> car c'est un nœud de départ */}
      
      <div className="flex items-center gap-2">
        <PlayCircle className="h-4 w-4 text-green-600" />
        <div>
          <div className="text-xs font-bold text-card-foreground">{data.label}</div>
          <div className="text-[11px] text-muted-foreground">Flow Trigger</div>
        </div>
      </div>
      
      {/* Une seule poignée de sortie */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

StartNode.displayName = 'StartNode';