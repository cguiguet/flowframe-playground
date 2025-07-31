import { ProcessNodeData } from './ProcessNode.definition';

// The input data for this node will be an array of outputs from its parents
type InputData = any[];

// The execution function
export const execute = async (
  input: InputData, 
  config: ProcessNodeData
): Promise<any> => {
  console.log('Executing ProcessNode with input:', input, 'and config:', config);

  // Example logic: transform the input data
  const result = input.map(item => ({
    ...item,
    processed: true,
    configValueUsed: config.configValue,
    timestamp: new Date().toISOString(),
  }));

  // Return the output data that will be passed to the next node
  return result;
};