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
      <div className="p-6 h-full flex items-center justify-center text-slate-500 bg-white rounded-lg m-4">
        <p>Select a node to configure it.</p>
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
    <div className="bg-white rounded-xl m-4 flex flex-col h-[calc(100%-2rem)]">
            <div className="p-6 border-b border-slate-200 shrink-0 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl text-slate-800">Configuration</h3>
          <p className="text-sm text-slate-500">{selectedNode.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-500 hover:bg-slate-100">
          <X className="h-5 w-5" />
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

      <div className="p-6 mt-auto border-t border-slate-200 shrink-0">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
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