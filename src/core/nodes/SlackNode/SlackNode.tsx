import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react'; // Une icône appropriée
import { cn } from '@/lib/utils';
import { SlackNodeData } from './SlackNode.definition';

/**
 * Les props pour le composant SlackNode, utilisant l'interface de données typée.
 */
interface SlackNodeProps {
  data: SlackNodeData;
  selected?: boolean;
}

/**
 * Le composant React qui affiche le SlackNode sur le canevas.
 */
export const SlackNode = memo(({ data, selected }: SlackNodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-card border-2 border-pink-400 min-w-[180px]", // Couleur Slack-like
      selected && "border-blue-500"
    )}>
      {/* Poignée d'entrée */}
      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />
      
      <div className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-pink-500" />
        <div>
          <div className="text-sm font-bold text-card-foreground">Slack</div>
          <div className="text-xs text-muted-foreground">Send to: {data.channel}</div>
        </div>
      </div>
      
      {/* Poignée de sortie */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

SlackNode.displayName = 'SlackNode';