import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SlackNodeData } from './SlackNode.definition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

/**
 * Defines the props required by this configuration form.
 * - `nodeData`: The current data of the node to display in the fields.
 * - `onDataChange`: A callback function to update the node's data.
 */
interface SlackNodeConfigurationProps {
  nodeData: SlackNodeData;
  onDataChange: (newData: SlackNodeData) => void;
}

/**
 * The specific form component for the Slack node.
 */
export const SlackNodeConfiguration: React.FC<SlackNodeConfigurationProps> = ({ nodeData, onDataChange }) => {

  /**
   * Handles changes for all form fields.
   * It uses the `name` attribute of the input to update the correct property.
   */
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
        <AlertTitle>How to get a Webhook URL</AlertTitle>
        <AlertDescription>
          You need to create a Slack App and generate an "Incoming Webhook" URL. 
          Follow the official Slack guide for instructions.
        </AlertDescription>
      </Alert>

      {/* Field for the Slack Webhook URL */}
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          name="webhookUrl" // Name must match the key in SlackNodeData
          value={nodeData.webhookUrl}
          onChange={handleInputChange}
          placeholder="https://hooks.slack.com/services/..."
          type="password" // Use password type to hide the secret URL
        />
      </div>

      {/* Field for the Slack channel name (optional) */}
      <div className="space-y-2">
        <Label htmlFor="channel">Channel (Optional)</Label>
        <Input
          id="channel"
          name="channel" // Name must match the key in SlackNodeData
          value={nodeData.channel}
          onChange={handleInputChange}
          placeholder="Overrides the webhook's default channel"
        />
      </div>

      {/* Field for the message content */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message" // Name must match the key in SlackNodeData
          value={nodeData.message}
          onChange={handleInputChange}
          placeholder="Enter your message. You can use expressions like {{ $json.message }}."
          rows={6}
        />
      </div>
    </div>
  );
};