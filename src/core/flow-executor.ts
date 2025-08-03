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
function getExecutionOrder(nodes: Node[], edges: Edge[], startNodeIds: string[]): string[] {
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

  // The queue starts with the given start nodes
  const queue = [...startNodeIds];
  
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
  if (result.length < nodes.length) {
    const nodeIdsInResult = new Set(result);
    const missingNodes = nodes.filter(n => !nodeIdsInResult.has(n.id)).map(n => n.id);
    console.error(`Error: A cycle was detected. Missing nodes from execution order: ${missingNodes.join(', ')}`);
    throw new Error('A cycle was detected in the graph, preventing execution.');
  }

  return result;
}

/**
 * Checks if the current flow is in a runnable state.
 * A flow is runnable if it contains at least one 'start' node and has no cycles.
 * 
 * @param nodes - The array of nodes from the React Flow state.
 * @param edges - The array of edges from the React Flow state.
 * @returns `true` if the flow is runnable, `false` otherwise.
 */
export function isFlowRunnable(nodes: Node[], edges: Edge[]): boolean {
  if (nodes.length === 0) {
    return false;
  }

  const hasStartNode = nodes.some(node => node.type === 'start');
  if (!hasStartNode) {
    return false;
  }

  try {
    const startNodes = nodes.filter(node => node.type === 'start');
    if (startNodes.length === 0) return false;

    const { reachableNodes, reachableEdges } = getReachableGraph(nodes, edges);
    if (reachableNodes.length === 0) return true; // No start node connected, but not an error state

    const startNodeIds = startNodes.map(n => n.id).filter(id => reachableNodes.some(rn => rn.id === id));
    getExecutionOrder(reachableNodes, reachableEdges, startNodeIds);
  } catch (error) {
    return false; // Cycle detected
  }

  return true;
}

/**
 * Executes a flow defined by a set of nodes and edges.
 * 
 * @param nodes - The array of nodes from the React Flow state.
 * @param edges - The array of edges from the React Flow state.
 * @returns An object containing the final status, a detailed log, and all node outputs.
 */
export async function runFlow(
  nodes: Node[],
  edges: Edge[],
  onNodeStart?: (nodeId: string | null) => void,
  onNodeError?: (nodeId: string, error: string) => void,
  onLogEntry?: (entry: ExecutionLogEntry) => void
) {
  const { reachableNodes, reachableEdges } = getReachableGraph(nodes, edges);
  const startNodeIds = reachableNodes.filter(n => n.type === 'start').map(n => n.id);

  if (startNodeIds.length === 0) {
    console.log('No start node found or connected. Nothing to execute.');
    onNodeStart?.(null);
    return {
      status: 'success',
      log: [],
      outputs: {},
    };
  }

  const executionOrder = getExecutionOrder(reachableNodes, reachableEdges, startNodeIds);
  const nodeMap = new Map(reachableNodes.map((node) => [node.id, node]));
  const outputs = new Map<string, any>();
  const executionLog: ExecutionLogEntry[] = [];

  console.log('Calculated Execution Order:', executionOrder);

  for (const nodeId of executionOrder) {
    onNodeStart?.(nodeId);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const node = nodeMap.get(nodeId)!;
      const executorInfo = nodeExecutors[node.type];

      if (!executorInfo || typeof executorInfo.execute !== 'function') {
        throw new Error(`No executor function found for node type: "${node.type}"`);
      }

      const parentEdges = reachableEdges.filter((edge) => edge.target === nodeId);
      const inputData = parentEdges.map((edge) => outputs.get(edge.source));
      const nodeOutput = await executorInfo.execute(inputData, node.data);

      const isStructuredOutput = typeof nodeOutput === 'object' && nodeOutput !== null && 'passthrough' in nodeOutput && 'logOutput' in nodeOutput;

      const logOutput = isStructuredOutput ? nodeOutput.logOutput : nodeOutput;
      const passthroughOutput = isStructuredOutput ? nodeOutput.passthrough : nodeOutput;

      outputs.set(nodeId, passthroughOutput);

      const logEntry: ExecutionLogEntry = {
        nodeId,
        nodeLabel: node.data.label || node.type,
        status: 'success',
        output: logOutput,
        timestamp: new Date().toISOString(),
      };
      executionLog.push(logEntry);
      onLogEntry?.(logEntry);
      console.log(`Node "${node.data.label || nodeId}" executed successfully.`);
    } catch (error: unknown) {
      const node = nodeMap.get(nodeId)!;
      const errorMessage = error instanceof Error ? error.message : String(error);

      onNodeError?.(nodeId, errorMessage);

      const logEntry: ExecutionLogEntry = {
        nodeId,
        nodeLabel: node.data.label || node.type,
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
      executionLog.push(logEntry);
      onLogEntry?.(logEntry);
      console.error(`Error executing node "${node.data.label || nodeId}": ${errorMessage}`);

      return {
        status: 'error',
        log: executionLog,
        outputs: Object.fromEntries(outputs),
      };
    }
  }

  onNodeStart?.(null);
  console.log('Flow execution completed successfully.');
  return {
    status: 'success',
    log: executionLog,
    outputs: Object.fromEntries(outputs),
  };
}

/**
 * Traverses the graph from the 'start' nodes to find all reachable nodes and edges.
 * This ensures that only the parts of the flow connected to a start node are executed.
 */
function getReachableGraph(nodes: Node[], edges: Edge[]): { reachableNodes: Node[], reachableEdges: Edge[] } {
  const adjList = new Map<string, string[]>();
  const edgeMap = new Map<string, Edge>();

  for (const node of nodes) {
    adjList.set(node.id, []);
  }

  for (const edge of edges) {
    if (adjList.has(edge.source)) {
      adjList.get(edge.source)!.push(edge.target);
    }
    edgeMap.set(edge.id, edge);
  }

  const startNodes = nodes.filter(node => node.type === 'start');
  const queue = startNodes.map(node => node.id);
  const visitedNodes = new Set<string>(queue);
  const reachableEdges = new Set<Edge>();

  while (queue.length > 0) {
    const u = queue.shift()!;

    for (const v of adjList.get(u) || []) {
      // Find the edge that connects u and v
      const connectingEdge = edges.find(e => e.source === u && e.target === v);
      if (connectingEdge) {
        reachableEdges.add(connectingEdge);
      }

      if (!visitedNodes.has(v)) {
        visitedNodes.add(v);
        queue.push(v);
      }
    }
  }

  const reachableNodes = nodes.filter(node => visitedNodes.has(node.id));

  return { reachableNodes, reachableEdges: Array.from(reachableEdges) };
}