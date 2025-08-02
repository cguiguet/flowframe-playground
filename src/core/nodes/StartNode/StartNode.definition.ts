import { Node } from '@xyflow/react';
import { StartNode } from './StartNode';

/**
 * Defines the data structure for the StartNode.
 * It contains a string that will be parsed as JSON.
 */
export type StartNodeData = {
  isRunning?: boolean;
  label: string;
  initialJsonData: string;
}

/**
 * The complete definition for the StartNode.
 */
export const StartNodeDefinition = {
  /**
   * The unique type identifier for the node.
   */
  type: 'start',
  
  /**
   * The React component for rendering.
   */
  component: StartNode,

  /**
   * Metadata for the side panel library.
   */
  library: {
    label: 'Start',
    description: 'Triggers the workflow with initial data.',
    category: 'Triggers',
  },

  /**
   * Creates a new node instance with default data.
   * @returns {Node<StartNodeData>} A new node object.
   */
  create: (): Node<StartNodeData> => ({
    id: '',
    type: 'start',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start',
      // We now wrap the data in a `json` property to mimic n8n's item structure.
      // This makes expression evaluation more consistent, e.g., `{{ $json.message }}`.
      initialJsonData: JSON.stringify(
        [
          {
            "json": {
              "message": "Hello from your new flow!",
              "runId": "abc-123"
            }
          }
        ],
        null,
        2 // Indentation for pretty printing
      ),
    },
  }),

  /**
   * Defines the connection handles.
   * A start node has NO inputs and one output.
   */
  handles: {
    inputs: [], // Crucial: an empty array for a trigger node
    outputs: [{ id: 'output', type: 'source' }],
  },
};