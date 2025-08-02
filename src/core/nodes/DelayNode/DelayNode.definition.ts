import { Node } from '@xyflow/react';
import { DelayNode } from './DelayNode';
import { DelayNodeConfiguration } from './DelayNode.configuration';

export type DelayUnit = 'seconds' | 'minutes' | 'hours';

/**
 * Defines the data structure for the Delay node.
 */
export interface DelayNodeData {
  isRunning?: boolean;
  error?: string;
  label: string;
  delay: number;
  unit: DelayUnit;
}

/**
 * The complete definition for the DelayNode.
 */
export const DelayNodeDefinition = {
  type: 'delay',
  component: DelayNode,
  configurationComponent: DelayNodeConfiguration,

  library: {
    label: 'Delay',
    description: 'Pauses the flow for a specified duration.',
    category: 'Utilities',
  },

  create: (): Node<DelayNodeData> => ({
    id: '',
    type: 'delay',
    position: { x: 0, y: 0 },
    data: {
      label: 'Wait',
      delay: 1,
      unit: 'seconds',
    },
  }),

  handles: {
    inputs: [{ id: 'input', type: 'target' }],
    outputs: [{ id: 'output', type: 'source' }],
  },
};