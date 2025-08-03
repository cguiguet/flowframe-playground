import { MinitapNodeData } from './MinitapNode.definition';
import { resolveExpression } from '@/lib/expression-resolver';

// The input data will be an array of outputs from parent nodes.
// Based on our StartNode, it will be: [[{ json: { message: '...' } }]]
type InputData = any[];

/**
 * The execution function for the MinitapNode.
 * @param input - Data from parent nodes.
 * @param config - The configuration of this specific node (from node.data).
 * @returns Data to be passed to child nodes.
 */
export const execute = async (
  input: InputData, 
  config: MinitapNodeData
): Promise<any> => {
  console.log('--- EXECUTING MINITAP NODE ---');

  // 1. Validate Configuration
  if (!config.minitapUrl) {
    throw new Error('Minitap URL is not configured for the Minitap node. Please add it in the Minitap node settings.');
  }

  if (!config.action) {
    throw new Error('Action is not configured for the Minitap node. Please add it in the Minitap node settings.');
  }
  
  // 2. Prepare the Request URL for the Vite Proxy
  const urlPath = config.minitapUrl.replace('https://minitap.com', '');
  const proxyUrl = `/api/minitap${urlPath}`;
  console.log(`Sending request to Minitap via proxy: ${proxyUrl}`);

  // 3. Perform the HTTP POST Request
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: config.action,
        expectedOutput: config.expectedOutput,
      }),
    });
    
    const responseBody = await response.text();
    
    if (!response.ok) {
      throw new Error(`Minitap API returned an error: ${response.status} - ${responseBody}`);
    }
    
    console.log('Minitap API Response:', responseBody);
    
    // 4. Return a success message and original data for the next node
    const outputData = (input[0] || []).map(item => ({
      ...item,
      minitap: {
        status: 'success',
        response: responseBody,
        sentAt: new Date().toISOString(),
      },
    }));
    
    console.log('--- MINITAP NODE FINISHED ---');
    return outputData;
    
  } catch (error) {
    console.error('Failed to send Minitap request:', error);
    if (error instanceof Error) {
        throw new Error(`Network error or issue sending Minitap request: ${error.message}`);
    }
    throw new Error('An unknown error occurred while sending the Minitap request.');
  }
};
