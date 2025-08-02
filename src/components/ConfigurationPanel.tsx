import React from 'react';
import { Node } from '@xyflow/react';
import { nodeConfigurationPanels } from '@/core/nodes/nodeRegistry';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

/**
 * Props pour le panneau de configuration.
 * - `selectedNode`: Le nœud actuellement sélectionné sur le canevas.
 * - `onNodeDataChange`: La fonction à appeler pour mettre à jour les données du nœud.
 */
interface ConfigurationPanelProps {
  selectedNode: Node | null;
  onNodeDataChange: (nodeId: string, newData: any) => void;
    onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

/**
 * Ce composant affiche dynamiquement le formulaire de configuration approprié
 * pour le nœud sélectionné.
 */
const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ selectedNode, onNodeDataChange, onDeleteNode, onClose }) => {
  // Si aucun nœud n'est sélectionné, afficher un message d'aide.
  if (!selectedNode) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-muted-foreground">
        <p>Sélectionnez un nœud pour le configurer.</p>
      </div>
    );
  }

  // Trouve le composant de configuration correspondant au type du nœud depuis le registre.
  const ConfigComponent = nodeConfigurationPanels[selectedNode.type];

  // Crée la fonction de rappel qui sera passée au formulaire enfant.
  // Elle encapsule l'ID du nœud pour que le parent puisse l'identifier.
  const handleDataChange = (newData: any) => {
    onNodeDataChange(selectedNode.id, newData);
  };

  return (
    <div className="border-l h-full bg-card flex flex-col">
            <div className="p-4 border-b shrink-0 flex justify-between items-center">
                <div>
          <h3 className="font-bold text-lg text-card-foreground">Configuration</h3>
          <p className="text-xs text-muted-foreground">Type: {selectedNode.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {ConfigComponent ? (
          // Si un composant de configuration existe pour ce type de nœud, on l'affiche.
          <ConfigComponent 
            nodeData={selectedNode.data}
            onDataChange={handleDataChange} 
          />
        ) : (
          // Sinon, on affiche un message par défaut.
          <div className="p-4 text-muted-foreground">
            <p>Ce nœud n'a pas de configuration spécifique.</p>
          </div>
        )}
      </div>

      <div className="p-4 mt-auto border-t shrink-0">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-2"
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;