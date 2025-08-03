import { Node } from '@xyflow/react';
import { MinitapNode } from './MinitapNode';
import { MinitapNodeConfiguration } from './MinitapNode.configuration';

/**
 * Defines the specific data structure for this node.
 * We add `minitapUrl` to store the Minitap URL.
 * We add `action` to store the Minitap action.
 * We add `expectedOutput` to store the Minitap expected output.
 */
export interface MinitapNodeData {
  isRunning?: boolean;
  error?: string;
  label: string;
  minitapUrl: string;
  action: string;
  expectedOutput: string;
}

/**
 * The complete definition for the MinitapNode.
 */
export const MinitapNodeDefinition: NodeDefinition<MinitapNodeData> = {
  /**
   * Unique type identifier.
   */
  type: 'minitap',
  
  /**
   * The React component for the canvas view.
   */
  component: MinitapNode,
   
  /**
   * The React component for the configuration panel.
   */
  configurationComponent: MinitapNodeConfiguration,
   
  /**
   * Metadata for the side panel library.
   */
  library: {
    label: 'Minitap',
    description: 'Sends a message to a Minitap server.',
    category: 'Services',
  },
  
  /**
   * Creates a new instance of the node with default values.
   */
  create: (): Node<MinitapNodeData> => ({
    id: '',
    type: 'minitap',
    position: { x: 0, y: 0 },
    data: {
      label: 'Send Message',
      minitapUrl: '',
      action: '',
      expectedOutput: '',
    },
  }),
  
  /**
   * Defines connection handles (inputs/outputs).
   */
  handles: {
    inputs: [{ id: 'input', type: 'target' }],
    outputs: [{ id: 'output', type: 'source' }],
  },
};
   
  
 