import { useState, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SidePanel from "@/components/SidePanel";
import NodeRedCanvas from "@/components/NodeRedCanvas";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection } from '@xyflow/react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
    // Mettre à jour aussi le nœud sélectionné pour que le panneau se rafraîchisse
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: newData } : null);
    }
  }, [setNodes, selectedNode]);
  
  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={selectedNode ? 60 : 80}>
          <NodeRedCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            setNodes={setNodes}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        
        {selectedNode && (
          <ResizablePanel defaultSize={20} minSize={15}>
            <ConfigurationPanel 
              selectedNode={selectedNode}
              onNodeDataChange={handleNodeDataChange}
            />
          </ResizablePanel>
        )}
        
        <ResizablePanel defaultSize={20} minSize={5} collapsible={true} collapsedSize={0}>
          <SidePanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;