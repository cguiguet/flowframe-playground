import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SidePanel from "@/components/SidePanel";
import NodeRedCanvas from "@/components/NodeRedCanvas";
import ConfigurationPanel from "@/components/ConfigurationPanel";

const Index = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <NodeRedCanvas onNodeClick={setSelectedNode} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={5} collapsible={true} collapsedSize={0}>
          <SidePanel />
        </ResizablePanel>
        {selectedNode && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15}>
              <ConfigurationPanel node={selectedNode} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
