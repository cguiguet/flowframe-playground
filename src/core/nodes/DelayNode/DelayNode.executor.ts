import { DelayNodeData } from './DelayNode.definition';

type InputData = any[];

/**
 * The execution function for the DelayNode.
 * It pauses execution for a specified duration.
 */
export const execute = async (
  input: InputData, 
  config: DelayNodeData
): Promise<any> => {
  const multipliers = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
  };

  const delayInMs = (config.delay || 0) * (multipliers[config.unit] || 1000);

  if (delayInMs <= 0) {
    // If no delay, just pass the data through immediately.
    return input[0];
  }

  console.log(`--- DELAY NODE: Pausing for ${config.delay} ${config.unit} (${delayInMs}ms) ---`);

  // Create a promise that resolves after the specified time
  await new Promise(resolve => setTimeout(resolve, delayInMs));

  console.log('--- DELAY NODE: Resuming execution ---');

  // Pass the original data through to the next node
  return input[0];
};