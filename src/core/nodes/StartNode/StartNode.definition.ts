import { Node } from '@xyflow/react';
import { StartNode } from './StartNode';

/**
 * Définit la structure des données pour le StartNode.
 * Il contient une chaîne de caractères qui sera parsée en tant que JSON.
 */
export interface StartNodeData {
  label: string;
  initialJsonData: string;
}

/**
 * La définition complète pour le StartNode.
 */
export const StartNodeDefinition = {
  /**
   * L'identifiant unique du type de nœud.
   */
  type: 'start',
  
  /**
   * Le composant React pour l'affichage.
   */
  component: StartNode,

  /**
   * Métadonnées pour la barre latérale.
   */
  library: {
    label: 'Start',
    category: 'Triggers', // Les nœuds de départ sont souvent appelés "Triggers"
  },

  /**
   * Crée une nouvelle instance du nœud avec des données par défaut.
   * @returns {Node<StartNodeData>} Un nouvel objet de nœud.
   */
  create: (): Node<StartNodeData> => ({
    id: '',
    type: 'start',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start',
      // Un exemple de JSON utile pour commencer
      initialJsonData: JSON.stringify(
        [
          {
            "message": "Hello World!",
            "runId": "abc-123"
          }
        ],
        null, //
        2 // Indentation pour une jolie mise en forme
      ),
    },
  }),

  /**
   * Définit les poignées de connexion.
   * Un nœud de départ n'a AUCUNE entrée (target) et une seule sortie (source).
   */
  handles: {
    inputs: [], // Très important : tableau vide !
    outputs: [{ id: 'output', type: 'source' }],
  },
};