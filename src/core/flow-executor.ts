import { Node, Edge } from '@xyflow/react';
import { nodeExecutors } from './nodes/nodeRegistry';

export type ExecutionLogEntry = {
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'error' | 'skipped';
  output?: any;
  error?: string;
  timestamp: string;
};

/**
 * Performs a topological sort on the graph of nodes and edges.
 * This algorithm determines a linear ordering of nodes such that for every directed edge
 * from node `u` to node `v`, `u` comes before `v` in the ordering. This is essential
 * for executing the flow in the correct sequence.
 * 
 * @param nodes - The array of nodes from the React Flow state.
 * @param edges - The array of edges from the React Flow state.
 * @returns An array of node IDs in the correct order of execution.
 */
function getExecutionOrder(nodes: Node[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();

  // Initialize data structures
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjList.set(node.id, []);
  }

  // Build the adjacency list and in-degree map from the edges
  for (const edge of edges) {
    if (adjList.has(edge.source)) {
      adjList.get(edge.source)!.push(edge.target);
    }
    if (inDegree.has(edge.target)) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  }

  // Find all nodes with an in-degree of 0 (i.e., start nodes)
  const queue = nodes
    .filter(node => inDegree.get(node.id) === 0)
    .map(node => node.id);
  
  const result: string[] = [];

  // Process the queue
  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);

    // For each neighbor of the current node, decrement its in-degree
    for (const v of adjList.get(u) || []) {
      const newDegree = (inDegree.get(v) || 0) - 1;
      inDegree.set(v, newDegree);
      
      // If a neighbor's in-degree becomes 0, add it to the queue
      if (newDegree === 0) {
        queue.push(v);
      }
    }
  }
  
  // If the result doesn't include all nodes, there's a cycle in the graph.
  if (result.length !== nodes.length) {
    console.error("Error: A cycle was detected in the graph. Flow execution cannot proceed.");
    return []; // Or throw an error
  }

  return result;
}

/**
 * Executes a flow defined by a set of nodes and edges.
 * 
 * @param nodes - The array of nodes from the React Flow state.
 * @param edges - The array of edges from the React Flow state.
 * @returns An object containing the final status, a detailed log, and all node outputs.
 */
export async function runFlow(nodes: Node[], edges: Edge[]) {
  const executionOrder = getExecutionOrder(nodes, edges);
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  
  // A map to store the output of each executed node. The key is the node ID.
  const outputs = new Map<string, any>();
  const executionLog: ExecutionLogEntry[] = [];

  console.log('Calculated Execution Order:', executionOrder);

  for (const nodeId of executionOrder) {
    try {
      const node = nodeMap.get(nodeId)!;
      const executorInfo = nodeExecutors[node.type];

      if (!executorInfo || typeof executorInfo.execute !== 'function') {
        throw new Error(`No executor function found for node type: "${node.type}"`);
      }

      // Find all edges connecting to the current node's inputs.
      const parentEdges = edges.filter(edge => edge.target === nodeId);
      
      // Gather the outputs from all parent nodes.
      const inputData = parentEdges.map(edge => outputs.get(edge.source));
      
      // Execute the node's logic.
      const nodeOutput = await executorInfo.execute(inputData, node.data);
      
      // Store the output for child nodes to use.
      outputs.set(nodeId, nodeOutput);

      executionLog.push({ 
        nodeId, 
        nodeLabel: node.data.label || node.type,
        status: 'success', 
        output: nodeOutput,
        timestamp: new Date().toISOString()
      });
      console.log(`Node "${node.data.label || nodeId}" executed successfully.`);

    } catch (error) {
      const node = nodeMap.get(nodeId)!;
      const errorMessage = error instanceof Error ? error.message : String(error);

      executionLog.push({ 
        nodeId, 
        nodeLabel: node.data.label || node.type,
        status: 'error', 
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      console.error(`Error executing node "${node.data.label || nodeId}":`, error);
      
      // If one node fails, we stop the entire execution.
      return { 
        success: false, 
        log: executionLog, 
        finalOutputs: Object.fromEntries(outputs) 
      };
    }
  }

  console.log('Flow execution completed successfully.');
  return { 
    success: true, 
    log: executionLog, 
    finalOutputs: Object.fromEntries(outputs) 
  };
}