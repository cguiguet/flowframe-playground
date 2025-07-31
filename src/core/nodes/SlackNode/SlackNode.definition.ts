import { Node } from '@xyflow/react';
import { SlackNode } from './SlackNode';

/**
 * Définit la structure des données spécifiques pour ce nœud.
 * Cela garantit la sécurité des types lors de l'accès à `node.data`.
 */
export interface SlackNodeData {
  label: string;
  channel: string;
  message: string;
}

/**
 * La source unique de vérité pour les propriétés et le comportement du SlackNode.
 */
export const SlackNodeDefinition = {
  /**
   * Un identifiant de type unique pour ce nœud.
   * Utilisé par React Flow pour savoir quel composant afficher.
   */
  type: 'slack',
  
  /**
   * Le composant React responsable de l'affichage du nœud sur le canevas.
   */
  component: SlackNode,

  /**
   * Métadonnées utilisées pour afficher ce nœud dans la bibliothèque de la barre latérale.
   */
  library: {
    label: 'Slack',
    category: 'Services',
  },

  /**
   * Une fonction "factory" qui retourne une nouvelle instance du nœud avec des valeurs par défaut.
   * @returns {Node<SlackNodeData>} Un nouvel objet de nœud.
   */
  create: (): Node<SlackNodeData> => ({
    id: '', // L'ID sera défini dynamiquement par React Flow
    type: 'slack',
    position: { x: 0, y: 0 },
    data: {
      label: 'Send Message',
      channel: '#general',
      message: 'Hello from your flow app!',
    },
  }),

  /**
   * Définit les points de connexion (poignées) d'entrée et de sortie pour le nœud.
   */
  handles: {
    inputs: [{ id: 'input', type: 'target' }],
    outputs: [{ id: 'output', type: 'source' }],
  },
};