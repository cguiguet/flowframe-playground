import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { nodeTypes, nodeLibrary } from '@/core/nodes/nodeRegistry';

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const NodeRedCanvas = ({ onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleRun = () => {
    console.log('Running flow with nodes:', nodes);
    // TODO: Implement execution logic
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full flex">
      {/* Node Library on the left */}
      <div className="w-48 bg-card border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-medium text-card-foreground">Node Library</h3>
        </div>
        <div className="flex-1 p-2 space-y-2">
          {nodeLibrary.map((node) => (
            <div
              key={node.type}
              className="p-2 bg-secondary rounded text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header with Run button */}
        <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
          <h2 className="text-sm font-medium text-card-foreground">Flow Canvas</h2>
          <Button onClick={handleRun} size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(event, node) => onNodeClick(node)}
            nodeTypes={nodeTypes}
            fitView
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default NodeRedCanvas;