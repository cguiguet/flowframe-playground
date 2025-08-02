import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidePanelProps {
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ onClose }) => {
  return (
    <div className="h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold text-card-foreground">Android Cloud Emulator</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 text-muted-foreground">
        Placeholder pour émulateur Android cloud - À venir
      </div>
    </div>
  );
};

export default SidePanel;