import { SlackNodeData } from './SlackNode.definition';
import { resolveExpression } from '@/lib/expression-resolver';

// The input data will be an array of outputs from parent nodes.
// Based on our StartNode, it will be: [[{ json: { message: '...' } }]]
type InputData = any[];

/**
 * The execution function for the SlackNode.
 * @param input - Data from parent nodes.
 * @param config - The configuration of this specific node (from node.data).
 * @returns Data to be passed to child nodes.
 */
export const execute = async (
  input: InputData, 
  config: SlackNodeData
): Promise<any> => {
  console.log('--- EXECUTING SLACK NODE ---');

  // 1. Validate Configuration
  if (!config.webhookUrl) {
    throw new Error('Webhook URL is not configured. Please add it in the Slack node settings.');
  }

  // A simple validation to ensure it looks like a Slack webhook URL.
  if (!config.webhookUrl.startsWith('https://hooks.slack.com/services/')) {
    throw new Error('The provided URL does not look like a valid Slack Webhook URL.');
  }

  // 2. Resolve Expressions from Input Data
  // For simplicity, we use the first item from the first input as our context.
  const firstItem = input?.[0]?.[0]; 

  const resolvedMessage = resolveExpression(config.message, firstItem);
  const resolvedChannel = resolveExpression(config.channel, firstItem);

  // 3. Prepare Slack Payload
  const payload: { text: string; channel?: string } = {
    text: resolvedMessage,
  };

  if (resolvedChannel) {
    payload.channel = resolvedChannel;
  }

  // 4. Prepare the Request URL for the Vite Proxy
  // The user provides the full URL, but we only need the path for our proxy.
  const urlPath = config.webhookUrl.replace('https://hooks.slack.com', '');
  const proxyUrl = `/api/slack${urlPath}`;

  console.log(`Sending message to Slack via proxy: ${proxyUrl}`);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  // 5. Perform the HTTP POST Request
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      // If Slack returns an error (e.g., bad URL, invalid channel), throw an error.
      throw new Error(`Slack API returned an error: ${response.status} - ${responseBody}`);
    }

    console.log('Slack API Response:', responseBody);

    // 6. Return a success message and original data for the next node
    const outputData = (input[0] || []).map(item => ({
      ...item,
      slack: {
        status: 'success',
        response: responseBody,
        sentAt: new Date().toISOString(),
      },
    }));
    
    console.log('--- SLACK NODE FINISHED ---');
    return outputData;

  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    // Re-throw the error to be caught by the flow-executor and logged properly.
    if (error instanceof Error) {
        throw new Error(`Network error or issue sending Slack notification: ${error.message}`);
    }
    throw new Error('An unknown error occurred while sending the Slack notification.');
  }
};