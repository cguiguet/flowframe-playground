import { useState, useCallback } from "react";
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection } from '@xyflow/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SidePanel from "@/components/SidePanel";
import NodeRedCanvas from "@/components/NodeRedCanvas";
import ConfigurationPanel from "@/components/ConfigurationPanel";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const Index = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <NodeRedCanvas 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={setSelectedNode}
            setNodes={setNodes}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={5} collapsible={true} collapsedSize={0}>
          <SidePanel />
        </ResizablePanel>
        {selectedNode && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15}>
              <ConfigurationPanel node={selectedNode} onDelete={handleDeleteNode} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
