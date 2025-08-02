import React, { useState } from 'react';
import { nodeLibrary } from '@/core/nodes/nodeRegistry';
import { Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const onDragStart = (event: React.DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const NodeLibrary = () => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isOpen = isPinned || isHovering;

  const categorizedNodes = nodeLibrary.reduce((acc, node) => {
    const category = node.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(node);
    return acc;
  }, {} as Record<string, typeof nodeLibrary>);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative h-full bg-card border-r border-border transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`}>
      
      {/* Header */}
      <div className={`p-3 flex items-center justify-between ${isOpen ? 'border-b' : ''} border-border`}>
        <h3 className={`text-lg font-bold text-card-foreground whitespace-nowrap overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Node Library
        </h3>
        <Button onClick={() => setIsPinned(!isPinned)} variant="ghost" size="icon" className="flex-shrink-0">
          {isPinned ? <PinOff className="h-5 w-5" /> : <Pin className="h-5 w-5" />}
        </Button>
      </div>

      {/* Content: Either the full library or the vertical text */}
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-3 space-y-4 h-full overflow-y-auto">
          {Object.entries(categorizedNodes).map(([category, nodes]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{category}</h4>
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    className="p-3 bg-secondary rounded-lg text-sm cursor-grab hover:bg-secondary/90 transition-colors shadow-sm"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type)}
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical text shown only when collapsed */}
      {!isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h4 
            className="text-sm font-semibold text-muted-foreground select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Node Library
          </h4>
        </div>
      )}
    </div>
  );
};

export default NodeLibrary;
