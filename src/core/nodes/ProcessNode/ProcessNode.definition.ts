import { Node } from '@xyflow/react';
import { ProcessNode } from './ProcessNode';

/**
 * Defines the specific data structure for this node.
 * This ensures type safety when accessing node.data.
 */
export interface ProcessNodeData {
  label: string;
  configValue?: string; // An example custom configuration property
}

/**
 * The single source of truth for the ProcessNode's properties and behavior.
 */
export const ProcessNodeDefinition = {
  /**
   * A unique type identifier for this node.
   * This is used by React Flow to know which component to render.
   */
  type: 'process',
  
  /**
   * The React component responsible for rendering the node on the canvas.
   */
  component: ProcessNode,

  /**
   * Metadata used to display this node in the side panel's component library.
   */
  library: {
    label: 'Process Node',
    description: 'A generic node for custom processing.',
    category: 'Custom',
  },

  /**
   * A factory function that returns a new node instance with default values.
   * This is called when a node is dragged onto the canvas.
   * @returns {Node<ProcessNodeData>} A new node object.
   */
  create: (): Node<ProcessNodeData> => ({
    id: '', // The ID will be dynamically set by React Flow
    type: 'process',
    position: { x: 0, y: 0 }, // Position will be set by React Flow
    data: {
      label: 'Process',
      configValue: 'Default Value',
    },
  }),

  /**
   * Defines the input and output connection points (handles) for the node.
   */
  handles: {
    inputs: [{ id: 'input', type: 'target' }],
    outputs: [{ id: 'output', type: 'source' }],
  },
};