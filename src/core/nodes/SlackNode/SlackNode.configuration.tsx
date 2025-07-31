import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SlackNodeData } from './SlackNode.definition';

/**
 * Définit les props requises par ce formulaire de configuration.
 * - `nodeData`: Les données actuelles du nœud à afficher dans les champs.
 * - `onDataChange`: Une fonction de rappel pour remonter les nouvelles données
 *   au composant parent lorsque l'utilisateur modifie un champ.
 */
interface SlackNodeConfigurationProps {
  nodeData: SlackNodeData;
  onDataChange: (newData: SlackNodeData) => void;
}

/**
 * Le composant de formulaire spécifique pour le nœud Slack.
 * Il est responsable de l'affichage et de la mise à jour des paramètres du nœud.
 */
export const SlackNodeConfiguration: React.FC<SlackNodeConfigurationProps> = ({ nodeData, onDataChange }) => {

  /**
   * Gère les changements sur tous les champs du formulaire.
   * Utilise l'attribut `name` des champs pour mettre à jour la bonne propriété dans l'état.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...nodeData,
      [name]: value,
    };
    onDataChange(updatedData); // Envoie les nouvelles données au state global
  };

  return (
    <div className="space-y-6 p-4">
      {/* Champ pour le nom du canal Slack */}
      <div className="space-y-2">
        <Label htmlFor="channel">Channel</Label>
        <Input
          id="channel"
          name="channel" // Le nom doit correspondre à la clé dans SlackNodeData
          value={nodeData.channel}
          onChange={handleInputChange}
          placeholder="Ex: #general, @user, etc."
        />
      </div>

      {/* Champ pour le contenu du message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message" // Le nom doit correspondre à la clé dans SlackNodeData
          value={nodeData.message}
          onChange={handleInputChange}
          placeholder="Entrez votre message. Vous pouvez utiliser des expressions comme {{ $json.message }}."
          rows={6}
        />
      </div>
    </div>
  );
};