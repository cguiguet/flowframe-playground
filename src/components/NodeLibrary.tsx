import React, { useState, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (nodeType: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredNode(nodeType);
    }, 300); // 0.3-second delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredNode(null);
  };

  const isOpen = !isCollapsed || isHovering;

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredNodes = nodeLibrary.filter(node => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = node.label.toLowerCase().includes(searchTermLower);
    const descriptionMatch = node.description?.toLowerCase().includes(searchTermLower) ?? false;
    return nameMatch || descriptionMatch;
  });

  const categorizedNodes = filteredNodes.reduce((acc, node) => {
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
      <div className={`p-3 flex flex-col gap-4 ${isOpen ? 'border-b' : ''} border-border`}>
        <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold text-slate-800 whitespace-nowrap overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Node Library
        </h3>
        <Button onClick={onToggleCollapse} variant="ghost" size="icon" className="flex-shrink-0">
          {isCollapsed ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
        </Button>
        </div>
        <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
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
                <div className="space-y-3 p-3">
                {nodes.map((node) => (
                  <div
                    key={node.type}
                    className="p-4 bg-white rounded-xl cursor-grab shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-slate-200"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type)}
                    onMouseEnter={() => handleMouseEnter(node.type)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="text-base font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">{node.label}</div>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${(searchTerm || hoveredNode === node.type) && node.description ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-slate-500">{node.description}</p>
                    </div>
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
