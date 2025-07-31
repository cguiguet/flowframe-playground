import { SlackNodeData } from './SlackNode.definition';

// Les données d'entrée pour ce nœud seront un tableau des sorties de ses parents
type InputData = any[];

/**
 * La fonction d'exécution pour le SlackNode.
 * @param input - Les données provenant des nœuds parents.
 * @param config - La configuration propre à ce nœud (depuis node.data).
 * @returns Les données à transmettre aux nœuds enfants.
 */
export const execute = async (
  input: InputData, 
  config: SlackNodeData
): Promise<any> => {
  console.log('--- EXECUTING SLACK NODE ---');
  console.log(`[Simulation] Sending Slack message to channel: ${config.channel}`);
  console.log(`[Simulation] Message content: ${config.message}`);
  console.log('Data received from previous node:', input);

  // Aplatir le tableau d'entrées pour s'assurer de traiter chaque item
  const flattenedInput = input.flat();

  // Simuler une opération : nous ajoutons une confirmation à chaque item reçu
  const outputData = flattenedInput.map(item => ({
    ...item, // On conserve les données d'origine
    slack_simulation: {
      status: 'sent_successfully',
      channel: config.channel,
      message: config.message,
      sentAt: new Date().toISOString(),
    }
  }));

  console.log('Data produced by Slack node:', outputData);
  console.log('----------------------------');

  // Retourner les données transformées pour le nœud suivant
  return outputData;
};