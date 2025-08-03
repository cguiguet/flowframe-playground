import React from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical, Play, Trash2, CheckCircle2, AlertCircle, MinusCircle, X, Smartphone } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ExecutionLogEntry } from '@/core/flow-executor';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  onClose: () => void;
  executionLog: ExecutionLogEntry[];
}

const FormattedJsonOutput: React.FC<{ data: any }> = ({ data }) => {
  if (typeof data !== 'object' || data === null) {
    return <span className="break-words">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 1 && typeof data[0] === 'object') {
      return <FormattedJsonOutput data={data[0]} />;
    }
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <FormattedJsonOutput key={index} data={item} />
        ))}
      </div>
    );
  }

  if (data.json && Object.keys(data).length === 1) {
    return <FormattedJsonOutput data={data.json} />;
  }

  return (
    <div className="space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-start">
          <span className="font-semibold text-gray-600 mr-2 shrink-0">{key}:</span>
          <FormattedJsonOutput data={value} />
        </div>
      ))}
    </div>
  );
};

const LogEntry: React.FC<{ entry: ExecutionLogEntry }> = ({ entry }) => {
  const statusIcon = {
    success: <CheckCircle2 size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    skipped: <MinusCircle size={18} className="text-gray-400" />,
  }[entry.status];

  const isSimpleOutput = typeof entry.output === 'string';

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-1">{statusIcon}</div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm text-gray-800">{entry.nodeLabel}</span>
          <span className="text-xs text-gray-400">
            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        {entry.status === 'error' && (
          <p className="text-xs text-red-600 mt-1 font-mono">{entry.error}</p>
        )}
        {entry.status === 'success' && entry.output && (
          <div className={cn('mt-1 text-sm', !isSimpleOutput && 'font-mono')}>
            <FormattedJsonOutput data={entry.output} />
          </div>
        )}
      </div>
    </div>
  );
};

const SidePanel: React.FC<SidePanelProps> = ({ onClose, executionLog }) => {
  return (
    <div className="bg-gray-50 h-full flex flex-col m-0 rounded-none">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">Run Panel</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow flex flex-col">
                <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-md font-bold text-gray-700 mb-3 shrink-0">Device Preview</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm flex-grow overflow-hidden">
                <div className="h-full aspect-[9/16] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border">
                  <Smartphone className="h-12 w-12 mb-4" />
                  <p className="text-sm font-medium">Live Android Device</p>
                  <p className="text-xs">Preview will appear here</p>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-md font-bold text-gray-700 mb-3 shrink-0">Run Logs</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm font-mono text-sm flex-grow overflow-y-auto">
                {executionLog.length > 0 ? (
                  executionLog.map((entry, index) => <LogEntry key={index} entry={entry} />)
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">Run a flow to see the logs.</p>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SidePanel;