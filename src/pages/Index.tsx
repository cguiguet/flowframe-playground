import { useState, useCallback, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SidePanel from "@/components/SidePanel";
import { runFlow, isFlowRunnable as checkIsFlowRunnable } from '@/core/flow-executor';
import NodeRedCanvas from "@/components/NodeRedCanvas";

import ConfigurationPanel from "@/components/ConfigurationPanel";
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection, NodeChange, MarkerType } from '@xyflow/react';
import { ExecutionLogEntry } from "@/core/flow-executor";

const initialNodes: Node[] = JSON.parse(localStorage.getItem('flow-nodes') || '[]');
const initialEdges: Edge[] = JSON.parse(localStorage.getItem('flow-edges') || '[]');

const Index = () => {
  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
      const [isFlowRunning, setIsFlowRunning] = useState(false);
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null);
    const [isEmulatorVisible, setIsEmulatorVisible] = useState(false);
    const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);
    const [isFlowRunnable, setIsFlowRunnable] = useState(false);
  const [executionLog, setExecutionLog] = useState<ExecutionLogEntry[]>([]);

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
    (params: Connection | Edge) => {
      const newEdge = { ...params, markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' }, style: { stroke: '#6b7280' } };
      setEdges((eds) => addEdge(newEdge, eds));
    },
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

  const handleNodeError = useCallback((nodeId: string, error: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, error } }
          : node
      )
    );
  }, [setNodes]);

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

    useEffect(() => {
    setIsFlowRunnable(checkIsFlowRunnable(nodes, edges));
    // Don't save the initial empty state
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem('flow-nodes', JSON.stringify(nodes));
      localStorage.setItem('flow-edges', JSON.stringify(edges));
    }
  }, [nodes, edges]);

  const handleCloseEmulator = () => {
    setIsEmulatorVisible(false);
  };

  const handleToggleLibrary = () => {
    setIsLibraryCollapsed(!isLibraryCollapsed);
  };

  const handleLogEntry = useCallback((entry: ExecutionLogEntry) => {
    setExecutionLog((prevLog) => [...prevLog, entry]);
  }, []);

    const handleRun = async () => {
    // Clear previous errors and logs
    setExecutionLog([]);
    setNodes((nds) =>
      nds.map((node) => {
        const { error, ...restData } = node.data;
        return { ...node, data: restData };
      })
    );
    
    setIsFlowRunning(true);
    setIsEmulatorVisible(true);
    if (!isLibraryCollapsed) {
      setIsLibraryCollapsed(true);
    }

    try {
      await runFlow(nodes, edges, setRunningNodeId, handleNodeError, handleLogEntry);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Flow execution failed:', errorMessage);
      // Optionally, update UI to show a general error message
    } finally {
      setIsFlowRunning(false);
      setRunningNodeId(null);
    }
  };
  
  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={isEmulatorVisible ? 50 : (selectedNode ? 80 : 100)}>
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
              isLibraryCollapsed={isLibraryCollapsed}
              onToggleLibrary={handleToggleLibrary}
              runningNodeId={runningNodeId}
              isFlowRunnable={isFlowRunnable}
            />
        </ResizablePanel>
        
        {selectedNode && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15}>
              <ConfigurationPanel 
                selectedNode={selectedNode}
                onNodeDataChange={handleNodeDataChange}
                onDeleteNode={deleteNode}
                onClose={handleClosePanel}
              />
            </ResizablePanel>
          </>
        )}

        {isEmulatorVisible && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={30}>
              <SidePanel onClose={handleCloseEmulator} executionLog={executionLog} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;