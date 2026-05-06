import { motion } from "framer-motion";
import type { TreeNode } from "@/lib/tree";

interface TreeVisualizationProps {
  tree: TreeNode;
  selectedNodeId: string | null;
  highlightedIds: Set<string>;
  pathIds: Set<string>;
  searchFoundId: string | null;
  onSelectNode: (id: string) => void;
}

export function TreeVisualization({
  tree,
  selectedNodeId,
  highlightedIds,
  pathIds,
  searchFoundId,
  onSelectNode,
}: TreeVisualizationProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex flex-col items-center">
        <TreeNodeComponent
          node={tree}
          selectedNodeId={selectedNodeId}
          highlightedIds={highlightedIds}
          pathIds={pathIds}
          searchFoundId={searchFoundId}
          onSelectNode={onSelectNode}
          depth={0}
        />
      </div>
    </div>
  );
}

function TreeNodeComponent({
  node,
  selectedNodeId,
  highlightedIds,
  pathIds,
  searchFoundId,
  onSelectNode,
  depth,
}: {
  node: TreeNode;
  selectedNodeId: string | null;
  highlightedIds: Set<string>;
  pathIds: Set<string>;
  searchFoundId: string | null;
  onSelectNode: (id: string) => void;
  depth: number;
}) {
  const isSelected = node.id === selectedNodeId;
  const isHighlighted = highlightedIds.has(node.id);
  const isPath = pathIds.has(node.id);
  const isSearchFound = node.id === searchFoundId;

  const getNodeClass = () => {
    if (isSearchFound) return "node-glow-search border-2";
    if (isPath) return "node-glow-path border-2";
    if (isHighlighted) return "node-glow-highlight border-2";
    if (isSelected) return "glow-border border-2";
    return "border border-node-border";
  };

  const typeIcons: Record<string, string> = {
    root: "🌌",
    planet: "🪐",
    resident: "👤",
    custom: "✦",
  };

  return (
    <div className="flex flex-col items-center">
      <motion.button
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: depth * 0.05 }}
        onClick={() => onSelectNode(node.id)}
        className={`
          relative px-3 py-2 rounded-lg bg-node-bg cursor-pointer
          transition-all duration-200 hover:scale-105 min-w-[90px] max-w-[140px]
          ${getNodeClass()}
        `}
      >
        <div className="text-xs font-mono text-muted-foreground mb-0.5">
          {typeIcons[node.type] || "✦"} {node.type}
        </div>
        <div className="text-sm font-semibold truncate text-foreground leading-tight">
          {node.name}
        </div>
        {node.data && (
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {node.type === "planet" && (node.data as { climate?: string }).climate}
            {node.type === "resident" && (node.data as { birth_year?: string }).birth_year}
          </div>
        )}
        {/* Degree badge */}
        {node.children.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {node.children.length}
          </span>
        )}
      </motion.button>

      {node.children.length > 0 && (
        <>
          {/* Vertical connector */}
          <div className="w-px h-5 bg-edge" />
          {/* Horizontal connector + children */}
          <div className="relative flex gap-2">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-edge"
                style={{
                  left: "calc(50% - " + ((node.children.length - 1) * 50) + "% + 45px)",
                  right: "calc(50% - " + ((node.children.length - 1) * 50) + "% + 45px)",
                }}
              />
            )}
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-5 bg-edge" />
                <TreeNodeComponent
                  node={child}
                  selectedNodeId={selectedNodeId}
                  highlightedIds={highlightedIds}
                  pathIds={pathIds}
                  searchFoundId={searchFoundId}
                  onSelectNode={onSelectNode}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
