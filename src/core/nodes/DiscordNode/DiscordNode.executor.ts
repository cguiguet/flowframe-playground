import { DiscordNodeData } from './DiscordNode.definition';
import { resolveExpression } from '@/lib/expression-resolver';

type InputData = any[];

/**
 * The execution function for the DiscordNode.
 * @param input - Data from parent nodes.
 * @param config - The configuration of this specific node.
 * @returns Data to be passed to child nodes.
 */
export const execute = async (
  input: InputData, 
  config: DiscordNodeData
): Promise<any> => {
  console.log('--- EXECUTING DISCORD NODE ---');

  // 1. Validate Configuration
  if (!config.webhookUrl) {
    throw new Error('Webhook URL is not configured for the Discord node.');
  }
  if (!config.webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    throw new Error('The provided URL does not look like a valid Discord Webhook URL.');
  }

  // 2. Resolve Expressions
  const firstItem = input?.[0]?.[0]; 
  const resolvedContent = resolveExpression(config.content, firstItem);

  // 3. Prepare Discord Payload
  const payload = {
    content: resolvedContent,
  };

  // 4. Prepare the Request URL for the Vite Proxy
  const urlPath = config.webhookUrl.replace('https://discord.com', '');
  const proxyUrl = `/api/discord${urlPath}`;

  console.log(`Sending message to Discord via proxy: ${proxyUrl}`);
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

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(`Discord API returned an error: ${response.status} - ${responseBody}`);
    }

    // Discord returns a 204 No Content on success, so no response body to log.
    console.log('Discord message sent successfully.');

    // 6. Return a success message and original data
    const outputData = (input[0] || []).map(item => ({
      ...item,
      discord: {
        status: 'success',
        sentAt: new Date().toISOString(),
      },
    }));
    
    console.log('--- DISCORD NODE FINISHED ---');
    return outputData;

  } catch (error) {
    console.error('Failed to send Discord notification:', error);
    if (error instanceof Error) {
        throw new Error(`Network error or issue sending Discord notification: ${error.message}`);
    }
    throw new Error('An unknown error occurred while sending the Discord notification.');
  }
};