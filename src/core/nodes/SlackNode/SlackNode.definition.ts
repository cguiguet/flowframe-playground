import { Node } from '@xyflow/react';
import { SlackNode } from './SlackNode';
import { SlackNodeConfiguration } from './SlackNode.configuration'; // Import du composant de configuration

/**
 * Définit la structure des données spécifiques pour ce nœud.
 */
export interface SlackNodeData {
  label: string;
  channel: string;
  message: string;
}

/**
 * La définition complète pour le SlackNode.
 */
export const SlackNodeDefinition = {
  /**
   * Identifiant de type unique.
   */
  type: 'slack',
  
  /**
   * Le composant React pour l'affichage sur le canevas.
   */
  component: SlackNode,

  /**
   * Le composant React pour le panneau de configuration.
   * C'est la nouvelle propriété clé qui lie un nœud à son formulaire.
   */
  configurationComponent: SlackNodeConfiguration,

  /**
   * Métadonnées pour la barre latérale.
   */
  library: {
    label: 'Slack',
    category: 'Services',
  },

  /**
   * Crée une nouvelle instance du nœud avec des valeurs par défaut.
   */
  create: (): Node<SlackNodeData> => ({
    id: '',
    type: 'slack',
    position: { x: 0, y: 0 },
    data: {
      label: 'Send Message',
      channel: '#general',
      message: 'Hello from your flow app!',
    },
  }),

  /**
   * Définit les poignées de connexion (entrées/sorties).
   */
  handles: {
    inputs: [{ id: 'input', type: 'target' }],
    outputs: [{ id: 'output', type: 'source' }],
  },
};