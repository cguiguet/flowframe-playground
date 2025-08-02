import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DelayNodeData, DelayUnit } from './DelayNode.definition';

interface DelayNodeConfigurationProps {
  nodeData: DelayNodeData;
  onDataChange: (newData: DelayNodeData) => void;
}

/**
 * The form component for configuring the Delay node.
 */
export const DelayNodeConfiguration: React.FC<DelayNodeConfigurationProps> = ({ nodeData, onDataChange }) => {

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    onDataChange({ ...nodeData, delay: isNaN(value) ? 0 : value });
  };

  const handleUnitChange = (value: DelayUnit) => {
    onDataChange({ ...nodeData, unit: value });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-3 items-center gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="delay">Delay</Label>
          <Input
            id="delay"
            name="delay"
            type="number"
            value={nodeData.delay}
            onChange={handleDelayChange}
            min={0}
          />
        </div>
        <div className="space-y-2 self-end">
          <Label htmlFor="unit">Unit</Label>
          <Select onValueChange={handleUnitChange} value={nodeData.unit}>
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};