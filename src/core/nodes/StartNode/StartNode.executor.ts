import { StartNodeData } from './StartNode.definition';

/**
 * La fonction d'exécution pour le StartNode.
 * @param input - Données des parents (sera toujours un tableau vide pour un nœud de départ).
 * @param config - La configuration du nœud, contenant le JSON à parser.
 * @returns Les données JSON parsées, qui serviront de point de départ au flux.
 */
export const execute = async (
  input: any[], 
  config: StartNodeData
): Promise<any> => {
  console.log('--- EXECUTING START NODE ---');

  try {
    // La logique principale : parser la chaîne de caractères JSON fournie dans la configuration.
    const initialData = JSON.parse(config.initialJsonData);
    
    console.log('Producing initial data:', initialData);
    console.log('--------------------------');

    // Retourne les données parsées. Elles seront transmises au nœud suivant.
    return initialData;

  } catch (error) {
    console.error('Invalid JSON in Start Node:', error);
    // Propage une erreur claire qui sera attrapée par le flow-executor
    throw new Error(`Invalid JSON format in Start Node. Please check your syntax.`);
  }
};