import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TreeNode } from "@/lib/tree";
import {
  treeHeight,
  nodeDegree,
  preOrder,
  inOrder,
  postOrder,
  bfs,
  searchTree,
  insertNode,
  deleteNode,
  findNode,
  nodeCount,
  generateId,
} from "@/lib/tree";
import { TreeVisualization } from "./TreeVisualization";
import { ControlPanel } from "./ControlPanel";
import { MetricsPanel } from "./MetricsPanel";
import { TraversalDisplay } from "./TraversalDisplay";

interface TreeExplorerProps {
  initialTree: TreeNode;
}

export function TreeExplorer({ initialTree }: TreeExplorerProps) {
  const [tree, setTree] = useState<TreeNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [pathIds, setPathIds] = useState<Set<string>>(new Set());
  const [searchFoundId, setSearchFoundId] = useState<string | null>(null);
  const [traversalResult, setTraversalResult] = useState<{ type: string; nodes: TreeNode[] } | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number>(-1);

  const selectedNode = selectedNodeId ? findNode(tree, selectedNodeId) : null;

  const animateTraversal = useCallback((type: string, nodes: TreeNode[]) => {
    setTraversalResult({ type, nodes });
    setHighlightedIds(new Set());
    setPathIds(new Set());
    setSearchFoundId(null);

    nodes.forEach((node, i) => {
      setTimeout(() => {
        setAnimatingIndex(i);
        setHighlightedIds((prev) => new Set([...prev, node.id]));
      }, i * 300);
    });

    setTimeout(() => setAnimatingIndex(-1), nodes.length * 300 + 500);
  }, []);

  const handleTraversal = useCallback(
    (type: "pre" | "in" | "post" | "bfs") => {
      const fns = { pre: preOrder, in: inOrder, post: postOrder, bfs };
      const labels = { pre: "Pré-ordem", in: "Em-ordem", post: "Pós-ordem", bfs: "BFS" };
      const result = fns[type](tree);
      animateTraversal(labels[type], result);
    },
    [tree, animateTraversal]
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      const path = searchTree(tree, query);
      setHighlightedIds(new Set());
      setTraversalResult(null);
      if (path) {
        setPathIds(new Set(path.map((n) => n.id)));
        setSearchFoundId(path[path.length - 1].id);
        setSelectedNodeId(path[path.length - 1].id);
      } else {
        setPathIds(new Set());
        setSearchFoundId(null);
      }
    },
    [tree]
  );

  const handleInsert = useCallback(
    (parentId: string, name: string) => {
      const newNode: TreeNode = {
        id: generateId(),
        name,
        type: "custom",
        children: [],
      };
      setTree((prev) => insertNode(prev, parentId, newNode));
      setHighlightedIds(new Set());
      setTraversalResult(null);
    },
    []
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      if (nodeId === tree.id) return; // Can't delete root
      const newTree = deleteNode(tree, nodeId);
      if (newTree) {
        setTree(newTree);
        if (selectedNodeId === nodeId) setSelectedNodeId(null);
        setHighlightedIds(new Set());
        setTraversalResult(null);
      }
    },
    [tree, selectedNodeId]
  );

  const clearHighlights = useCallback(() => {
    setHighlightedIds(new Set());
    setPathIds(new Set());
    setSearchFoundId(null);
    setTraversalResult(null);
    setAnimatingIndex(-1);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-primary glow-text">
              SWAPI TREE
            </h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">
              Árvore Interativa — Star Wars API · Planetas → Residentes
            </p>
          </div>
          <MetricsPanel tree={tree} selectedNode={selectedNode} />
        </div>
      </header>

      {/* Controls */}
      <ControlPanel
        onTraversal={handleTraversal}
        onSearch={handleSearch}
        onInsert={handleInsert}
        onDelete={handleDelete}
        onClear={clearHighlights}
        selectedNodeId={selectedNodeId}
        selectedNodeName={selectedNode?.name ?? null}
        isRoot={selectedNodeId === tree.id}
      />

      {/* Traversal result bar */}
      <AnimatePresence>
        {traversalResult && (
          <TraversalDisplay
            type={traversalResult.type}
            nodes={traversalResult.nodes}
            animatingIndex={animatingIndex}
          />
        )}
      </AnimatePresence>

      {/* Tree visualization */}
      <div className="flex-1 overflow-auto p-6">
        <TreeVisualization
          tree={tree}
          selectedNodeId={selectedNodeId}
          highlightedIds={highlightedIds}
          pathIds={pathIds}
          searchFoundId={searchFoundId}
          onSelectNode={setSelectedNodeId}
        />
      </div>
    </div>
  );
}
