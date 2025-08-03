import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MinitapNodeData } from './MinitapNode.definition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

/**
 * Defines the props required by this configuration form.
 * - `nodeData`: The current data of the node to display in the fields.
 * - `onDataChange`: A callback function to update the node's data.
 */
 interface MinitapNodeConfigurationProps {
  nodeData: MinitapNodeData;
  onDataChange: (newData: MinitapNodeData) => void;
}

/**
 * The specific form component for the Minitap node.
 */
export const MinitapNodeConfiguration: React.FC<MinitapNodeConfigurationProps> = ({ nodeData, onDataChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...nodeData,
      [name]: value,
    };
    onDataChange(updatedData); // Send new data to the global state
  };

  return (
    <div className="space-y-6 p-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How to use a minitap node</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-2">
            <p>You simply need to provide the Minitap URL, the action, and the expected output.</p>
            <div className="pl-4 border-l-2 border-slate-300">
              <p className="font-semibold">Example of an action:</p>
              <p className="italic">"I want to get the number of employees in company X."</p>
            </div>
            <div className="pl-4 border-l-2 border-slate-300">
              <p className="font-semibold">Example of an expected output:</p>
              <p className="italic">"A JSON file representing the number of employees in company X."</p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Field for the Minitap URL */}
      <div className="space-y-2">
        <Label htmlFor="minitapUrl">Minitap URL</Label>
        <Input
          id="minitapUrl"
          name="minitapUrl" // Name must match the key in MinitapNodeData
          value={nodeData.minitapUrl}
          onChange={handleInputChange}
          placeholder="https://minitap.com/api/v1"
          type="password" // Use password type to hide the secret URL
        />
      </div>

      {/* Field for the action */}
      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Input
          id="action"
          name="action" // Name must match the key in MinitapNodeData
          value={nodeData.action}
          onChange={handleInputChange}
          placeholder="I want to get the number of employees in the company X"
        />
      </div>

      {/* Field for the expected output */}
      <div className="space-y-2">
        <Label htmlFor="expectedOutput">Expected Output</Label>
        <Input
          id="expectedOutput"
          name="expectedOutput" // Name must match the key in MinitapNodeData
          value={nodeData.expectedOutput}
          onChange={handleInputChange}
          placeholder="json file representinf the number of employees in the company X"
        />
      </div>
    </div>
  );
};