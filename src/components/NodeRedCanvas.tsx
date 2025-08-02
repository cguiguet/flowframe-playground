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
import { nodeTypes, allNodeDefinitions } from '@/core/nodes/nodeRegistry';
import NodeLibrary from './NodeLibrary';
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
      <NodeLibrary />
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