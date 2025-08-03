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

  const output = {
    passthrough: input[0],
    logOutput: `Waited for ${delayInMs} ms`
  };

  if (delayInMs <= 0) {
    return output;
  }

  console.log(`--- DELAY NODE: Pausing for ${config.delay} ${config.unit} (${delayInMs}ms) ---`);

  // Create a promise that resolves after the specified time
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('--- DELAY NODE: Resuming execution ---');
      resolve(output);
    }, delayInMs);
  });
};