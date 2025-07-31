import React from 'react';

const ConfigurationPanel = ({ node }) => {
  if (!node) {
    return null;
  }

  return (
    <div className="p-4 border-l h-full">
      <h3 className="font-bold mb-4">Configuration</h3>
      <p>ID: {node.id}</p>
      <p>Type: {node.type}</p>
      {/* Add more configuration options here */}
    </div>
  );
};

export default ConfigurationPanel;
