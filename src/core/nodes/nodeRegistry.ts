/**
 * This file acts as a dynamic registry for all nodes in the application.
 * It uses Vite's glob import feature to automatically discover and process
 * all node definition files.
 */

// Use Vite's glob import to find all files ending in `.definition.ts`.
// The `eager: true` option imports the modules immediately.
const nodeDefinitionModules = import.meta.glob('./**/!(*.test).definition.ts', { eager: true });

// Extract the actual definition object from each imported module.
const allNodeDefinitions = Object.values(nodeDefinitionModules).map((module: any) => {
  // Assuming each definition file exports a single definition object.
  return module[Object.keys(module)[0]];
});

/**
 * A map of node types to their corresponding React components.
 * This is consumed directly by the <ReactFlow /> component.
 * Example: { process: ProcessNodeComponent, alert: AlertNodeComponent }
 */
export const nodeTypes = Object.fromEntries(
  allNodeDefinitions.map(def => [def.type, def.component])
);

/**
 * An array of node metadata for displaying in the side panel's node library.
 * This makes it easy to render a list of available nodes for the user to drag.
 */
export const nodeLibrary = allNodeDefinitions.map(def => ({
  type: def.type,
  label: def.library.label,
  category: def.library.category,
}));

/**
 * A map of node types to their executor functions.
 * This is used by the flow-executor to run the logic for each node.
 * We use dynamic imports for the executors to support code-splitting and
 * keep the initial bundle size small.
 */
export const nodeExecutors = Object.fromEntries(
  allNodeDefinitions.map(def => [
    def.type, 
    {
      // The `execute` function is loaded on-demand when the flow runs.
      execute: async (...args: any[]) => {
        // The path is constructed dynamically based on the component's name.
        // This assumes a consistent file naming convention.
        const executorModule = await import(`./${def.component.name}/${def.component.name}.executor.ts`);
        return executorModule.execute(...args);
      }
    }
  ])
);