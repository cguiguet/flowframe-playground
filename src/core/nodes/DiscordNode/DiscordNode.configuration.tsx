import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiscordNodeData } from './DiscordNode.definition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

/**
 * Props required by this configuration form.
 */
interface DiscordNodeConfigurationProps {
  nodeData: DiscordNodeData;
  onDataChange: (newData: DiscordNodeData) => void;
}

/**
 * The specific form component for the Discord node.
 */
export const DiscordNodeConfiguration: React.FC<DiscordNodeConfigurationProps> = ({ nodeData, onDataChange }) => {

  /**
   * Handles changes for all form fields.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...nodeData,
      [name]: value,
    };
    onDataChange(updatedData);
  };

  return (
    <div className="space-y-6 p-4">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>How to get a Webhook URL</AlertTitle>
        <AlertDescription>
          In your Discord server, go to Server Settings → Integrations → Webhooks to create a new webhook URL for a channel.
        </AlertDescription>
      </Alert>

      {/* Field for the Discord Webhook URL */}
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          name="webhookUrl"
          value={nodeData.webhookUrl}
          onChange={handleInputChange}
          placeholder="https://discord.com/api/webhooks/..."
          type="password" // Hide the secret URL
        />
      </div>

      {/* Field for the message content */}
      <div className="space-y-2">
        <Label htmlFor="content">Message Content</Label>
        <Textarea
          id="content"
          name="content" // This must be 'content' to match Discord's API
          value={nodeData.content}
          onChange={handleInputChange}
          placeholder="Enter your message. You can use expressions like {{ $json.message }}."
          rows={6}
        />
      </div>
    </div>
  );
};