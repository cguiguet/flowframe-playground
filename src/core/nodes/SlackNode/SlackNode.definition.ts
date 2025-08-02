import { Node } from '@xyflow/react';
import { SlackNode } from './SlackNode';
import { SlackNodeConfiguration } from './SlackNode.configuration';

/**
 * Defines the specific data structure for this node.
 * We add `webhookUrl` to store the Slack Incoming Webhook URL.
 */
export interface SlackNodeData {
  isRunning?: boolean;
  label: string;
  channel: string;
  message: string;
  webhookUrl: string;
}

/**
 * The complete definition for the SlackNode.
 */
export const SlackNodeDefinition = {
  /**
   * Unique type identifier.
   */
  type: 'slack',
  
  /**
   * The React component for the canvas view.
   */
  component: SlackNode,

  /**
   * The React component for the configuration panel.
   */
  configurationComponent: SlackNodeConfiguration,

  /**
   * Metadata for the side panel library.
   */
  library: {
    label: 'Slack',
    description: 'Sends a message to a Slack channel.',
    category: 'Services',
  },

  /**
   * Creates a new instance of the node with default values.
   */
  create: (): Node<SlackNodeData> => ({
    id: '',
    type: 'slack',
    position: { x: 0, y: 0 },
    data: {
      label: 'Send Message',
      channel: '', // Channel is optional in Slack's webhook payload
      message: 'Hello from your flow app! Data from start node: {{ $json.message }}',
      webhookUrl: '', // <-- ADD THIS LINE with a default empty value
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