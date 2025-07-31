// Export all custom nodes for easy registration
export { default as CustomNode } from './CustomNode';
export { default as ProcessNode } from './ProcessNode';

import CustomNode from './CustomNode';
import ProcessNode from './ProcessNode';

// Node types registry - add new custom nodes here
export const nodeTypes = {
  custom: CustomNode,
  process: ProcessNode,
};

// Node library configuration for the sidebar
export const nodeLibrary = [
  {
    type: 'input',
    label: 'Input Node',
    category: 'Basic',
  },
  {
    type: 'custom',
    label: 'Custom Node',
    category: 'Custom',
  },
  {
    type: 'process',
    label: 'Process Node',
    category: 'Custom',
  },
  {
    type: 'output',
    label: 'Output Node',
    category: 'Basic',
  },
];