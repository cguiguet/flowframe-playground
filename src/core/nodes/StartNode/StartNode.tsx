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
      "px-4 py-3 shadow-md rounded-lg bg-card border-2 border-green-500 w-[180px]",
      selected && "border-blue-500"
    )}>
      {/* Pas de poignée <Handle type="target"> car c'est un nœud de départ */}
      
      <div className="flex items-center gap-3">
        <PlayCircle className="h-6 w-6 text-green-600" />
        <div>
          <div className="text-base font-bold text-card-foreground">{data.label}</div>
          <div className="text-xs text-muted-foreground">Flow Trigger</div>
        </div>
      </div>
      
      {/* Une seule poignée de sortie */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

StartNode.displayName = 'StartNode';