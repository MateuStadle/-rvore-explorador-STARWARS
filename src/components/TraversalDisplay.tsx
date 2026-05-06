import { motion } from "framer-motion";
import type { TreeNode } from "@/lib/tree";

interface TraversalDisplayProps {
  type: string;
  nodes: TreeNode[];
  animatingIndex: number;
}

export function TraversalDisplay({ type, nodes, animatingIndex }: TraversalDisplayProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-b border-border bg-secondary/30 backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 py-3 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-primary uppercase tracking-wider font-bold">
            {type}
          </span>
          <span className="text-xs text-muted-foreground">
            {nodes.length} nós visitados
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {nodes.map((node, i) => (
            <motion.span
              key={`${node.id}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                px-2 py-0.5 rounded text-xs font-mono border
                ${i <= animatingIndex
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground"
                }
              `}
            >
              {node.name}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
