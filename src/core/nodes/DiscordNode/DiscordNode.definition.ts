import { Node } from '@xyflow/react';
import { DiscordNode } from './DiscordNode';
import { DiscordNodeConfiguration } from './DiscordNode.configuration';

/**
 * Defines the data structure for the Discord node.
 * It includes the webhook URL and the message content.
 */
export interface DiscordNodeData {
  isRunning?: boolean;
  error?: string;
  label: string;
  content: string; // Changed from 'message' to 'content' to match Discord's API
  webhookUrl: string;
}

/**
 * The complete definition for the DiscordNode.
 */
export const DiscordNodeDefinition = {
  /**
   * Unique type identifier.
   */
  type: 'discord',
  
  /**
   * The React component for the canvas view.
   */
  component: DiscordNode,

  /**
   * The React component for the configuration panel.
   */
  configurationComponent: DiscordNodeConfiguration,

  /**
   * Metadata for the side panel library.
   */
  library: {
    label: 'Discord',
    description: 'Sends a message to a Discord channel.',
    category: 'Services',
  },

  /**
   * Creates a new instance of the node with default values.
   */
  create: (): Node<DiscordNodeData> => ({
    id: '',
    type: 'discord',
    position: { x: 0, y: 0 },
    data: {
      label: 'Send Message',
      content: 'Hello from Discord! Data: {{ $json.message }}',
      webhookUrl: '',
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