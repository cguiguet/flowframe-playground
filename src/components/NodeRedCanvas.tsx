import React, { useCallback, useEffect } from 'react';
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
import { Play, Loader, MousePointerClick } from 'lucide-react';
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
  onPaneClick,
  setNodes,
  isRunning,
  handleRun,
  isLibraryCollapsed,
  onToggleLibrary,
  runningNodeId,
  isFlowRunnable
}) => {
    const { screenToFlowPosition, fitView } = useReactFlow();

  useEffect(() => {
    if (isRunning) {
      fitView({ duration: 300 });
    }
  }, [isRunning, fitView]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isRunning: node.id === runningNodeId,
        },
      }))
    );
  }, [runningNodeId, setNodes]);



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
      <NodeLibrary isCollapsed={isLibraryCollapsed} onToggleCollapse={onToggleLibrary} />
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => onNodeClick(node)}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 pointer-events-none">
              <MousePointerClick className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Start building your flow</h2>
              <p>Drag and drop a block here, or use one of our templates to get started.</p>
            </div>
          )}
        </ReactFlow>
        <Button onClick={handleRun} size="sm" className="gap-2 absolute top-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFlowRunnable || isRunning}>
          {isRunning ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>
    </div>
  );
};

// Composant principal qui fournit le contexte React Flow
const NodeRedCanvas = (props: any) => {
  return (
    <ReactFlowProvider>
      <CanvasContent {...props} />
    </ReactFlowProvider>
  );
};

export default NodeRedCanvas;