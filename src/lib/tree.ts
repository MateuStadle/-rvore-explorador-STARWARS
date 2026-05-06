export interface TreeNode {
  id: string;
  name: string;
  type: "root" | "planet" | "resident" | "custom";
  data?: Record<string, unknown>;
  children: TreeNode[];
}

let idCounter = 1000;
export function generateId(): string {
  return `custom-${idCounter++}`;
}

// Traversals
export function preOrder(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node];
  for (const child of node.children) {
    result.push(...preOrder(child));
  }
  return result;
}

export function inOrder(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [];
  const children = node.children;
  const mid = Math.floor(children.length / 2);
  for (let i = 0; i < mid; i++) {
    result.push(...inOrder(children[i]));
  }
  result.push(node);
  for (let i = mid; i < children.length; i++) {
    result.push(...inOrder(children[i]));
  }
  return result;
}

export function postOrder(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [];
  for (const child of node.children) {
    result.push(...postOrder(child));
  }
  result.push(node);
  return result;
}

// BFS
export function bfs(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [];
  const queue: TreeNode[] = [node];
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    queue.push(...current.children);
  }
  return result;
}

// Search - returns path from root to found node
export function searchTree(root: TreeNode, query: string): TreeNode[] | null {
  const q = query.toLowerCase();
  function dfs(node: TreeNode, path: TreeNode[]): TreeNode[] | null {
    const currentPath = [...path, node];
    if (node.name.toLowerCase().includes(q)) {
      return currentPath;
    }
    for (const child of node.children) {
      const found = dfs(child, currentPath);
      if (found) return found;
    }
    return null;
  }
  return dfs(root, []);
}

// Tree height
export function treeHeight(node: TreeNode): number {
  if (node.children.length === 0) return 0;
  return 1 + Math.max(...node.children.map(treeHeight));
}

// Node degree
export function nodeDegree(node: TreeNode): number {
  return node.children.length;
}

// Total node count
export function nodeCount(node: TreeNode): number {
  return 1 + node.children.reduce((sum, c) => sum + nodeCount(c), 0);
}

// Insert a child node
export function insertNode(root: TreeNode, parentId: string, newNode: TreeNode): TreeNode {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, newNode] };
  }
  return {
    ...root,
    children: root.children.map((c) => insertNode(c, parentId, newNode)),
  };
}

// Delete a node by id (children are removed too)
export function deleteNode(root: TreeNode, nodeId: string): TreeNode | null {
  if (root.id === nodeId) return null;
  return {
    ...root,
    children: root.children
      .map((c) => deleteNode(c, nodeId))
      .filter((c): c is TreeNode => c !== null),
  };
}

// Find node by id
export function findNode(root: TreeNode, nodeId: string): TreeNode | null {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  return null;
}
