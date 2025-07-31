import React from 'react';
import NodeRedCanvas from '@/components/NodeRedCanvas';
import SidePanel from '@/components/SidePanel';

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Panel 2/3 - Node-RED Canvas */}
      <div className="w-2/3">
        <NodeRedCanvas />
      </div>
      
      {/* Panel 1/3 - Android Emulator */}
      <div className="w-1/3">
        <SidePanel />
      </div>
    </div>
  );
};

export default Index;
