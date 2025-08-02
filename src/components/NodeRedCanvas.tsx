import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Play, Loader } from 'lucide-react';
import { nodeTypes, nodeLibrary, allNodeDefinitions } from '@/core/nodes/nodeRegistry';
import { runFlow } from '@/core/flow-executor';
import { nanoid } from 'nanoid';

// Sous-composant pour avoir accès au hook `useReactFlow`
const CanvasContent = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeClick,
  setNodes 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  const handleRun = async () => {
    setIsRunning(true);
    const result = await runFlow(nodes, edges);
    console.log('Flow Result:', result);
    alert(`Flow finished with status: ${result.success ? 'Success' : 'Error'}`);
    setIsRunning(false);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const nodeDefinition = allNodeDefinitions.find(def => def.type === type);
      
      if (nodeDefinition) {
        const newNode = nodeDefinition.create();
        newNode.id = nanoid();
        newNode.position = position;
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="h-full flex">
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
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
          <h2 className="text-sm font-medium text-card-foreground">Flow Canvas</h2>
          <Button onClick={handleRun} size="sm" className="gap-2" disabled={isRunning}>
            {isRunning ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(event, node) => onNodeClick(node)}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
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

// Composant principal qui fournit le contexte React Flow
const NodeRedCanvas = (props) => {
  return (
    <ReactFlowProvider>
      <CanvasContent {...props} />
    </ReactFlowProvider>
  );
};

export default NodeRedCanvas;