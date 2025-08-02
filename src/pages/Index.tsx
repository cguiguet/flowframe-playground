import { useState, useCallback, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SidePanel from "@/components/SidePanel";
import { runFlow } from '@/core/flow-executor';
import NodeRedCanvas from "@/components/NodeRedCanvas";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection, NodeChange } from '@xyflow/react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Index = () => {
  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isFlowRunning, setIsFlowRunning] = useState(false);
  const [isEmulatorVisible, setIsEmulatorVisible] = useState(false);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChangeOriginal(changes);

    const selectionChange = changes.find((change): change is NodeChange & { type: 'select' } => change.type === 'select');

    if (selectionChange) {
      if (!selectionChange.selected) {
        // If the currently selected node is the one being deselected, close the panel.
        setSelectedNode(prev => prev?.id === selectionChange.id ? null : prev);
      }
    }
  }, [onNodesChangeOriginal]);

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

  const handleClosePanel = useCallback(() => {
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

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
    }, [setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedNode?.id,
      }))
    );
      }, [selectedNode, setNodes]);

  const handleCloseEmulator = () => {
    setIsEmulatorVisible(false);
  };

    const handleRun = async () => {
    setIsFlowRunning(true);
    setIsEmulatorVisible(true);
    console.log('Running flow with:', { nodes, edges });
    try {
      const result = await runFlow(nodes, edges);
      console.log('Flow Result:', result);
      // Optionally, show a success message
    } catch (error) {
      console.error('Flow execution failed:', error);
      // Optionally, show an error message
    } finally {
            setIsFlowRunning(false);
    }
  };
  
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
                        isRunning={isFlowRunning}
            handleRun={handleRun}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        
        {selectedNode && (
          <ResizablePanel defaultSize={20} minSize={15}>
            <ConfigurationPanel 
              selectedNode={selectedNode}
              onNodeDataChange={handleNodeDataChange}
              onDeleteNode={deleteNode}
              onClose={handleClosePanel}
            />
          </ResizablePanel>
        )}
        
                {isEmulatorVisible && (
          <ResizablePanel defaultSize={20} minSize={5} collapsible={true} collapsedSize={0}>
                        <SidePanel onClose={handleCloseEmulator} />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;