import React, { useState, useEffect } from 'react';
import { nodeLibrary } from '@/core/nodes/nodeRegistry';
import { Pin, PinOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const onDragStart = (event: React.DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

interface NodeLibraryProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const NodeLibrary: React.FC<NodeLibraryProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const isOpen = !isCollapsed || isHovering;

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

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
      className={`relative h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-20'}`}>
      
      {/* Header */}
      <div className={`p-3 flex items-center justify-between ${isOpen ? 'border-b' : ''} border-border`}>
        <h3 className={`text-xl font-bold text-slate-800 whitespace-nowrap overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Node Library
        </h3>
                <Button onClick={onToggleCollapse} variant="ghost" size="icon" className="flex-shrink-0">
                    {isCollapsed ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
        </Button>
      </div>

      {/* Content: Either the full library or the vertical text */}
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-4 space-y-6 h-full overflow-y-auto">
          {Object.entries(categorizedNodes).map(([category, nodes]) => (
            <div key={category}>
                            <div onClick={() => toggleCategory(category)} className="flex items-center justify-between cursor-pointer">
                <h4 className="text-lg font-bold text-slate-700">{category}</h4>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${collapsedCategories[category] ? '' : 'rotate-180'}`} />
              </div>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${collapsedCategories[category] ? 'max-h-0' : 'max-h-screen'}`}>
                <div className="space-y-3 pt-3">
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    className="p-4 bg-white rounded-xl text-base font-medium text-slate-700 cursor-grab shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-slate-200"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type)}
                  >
                    {node.label}
                  </div>
                ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical text shown only when collapsed */}
      {!isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h4 
            className="text-lg font-bold text-slate-700 select-none"
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
