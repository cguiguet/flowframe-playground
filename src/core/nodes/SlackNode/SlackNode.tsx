import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <div
      className={cn(
        'relative px-3 py-1.5 shadow-md rounded-md bg-card border border-pink-400 min-w-[150px]', // Couleur Slack-like
        data.isRunning && !data.error ? 'ring-2 ring-offset-2 ring-pink-500 ring-offset-white' : '',
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

      {/* Poignée d'entrée */}
      <Handle type="target" position={Position.Left} id="input" className="w-2 h-2" />

      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-pink-500" />
        <div>
          <div className="text-xs font-bold text-card-foreground">Slack</div>
          <div className="text-[11px] text-muted-foreground">
            Send to: {data.channel}
          </div>
        </div>
      </div>

      {/* Poignée de sortie */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2" />
    </div>
  );
});

SlackNode.displayName = 'SlackNode';