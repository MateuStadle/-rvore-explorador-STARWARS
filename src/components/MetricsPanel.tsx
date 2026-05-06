import type { TreeNode } from "@/lib/tree";
import { treeHeight, nodeDegree, nodeCount } from "@/lib/tree";

interface MetricsPanelProps {
  tree: TreeNode;
  selectedNode: TreeNode | null;
}

export function MetricsPanel({ tree, selectedNode }: MetricsPanelProps) {
  const height = treeHeight(tree);
  const total = nodeCount(tree);

  return (
    <div className="flex items-center gap-5">
      <Metric label="Altura" value={height} />
      <Metric label="Total Nós" value={total} />
      {selectedNode && (
        <>
          <div className="w-px h-6 bg-border" />
          <Metric label="Grau" value={nodeDegree(selectedNode)} highlight />
          <Metric label="Sub-altura" value={treeHeight(selectedNode)} highlight />
        </>
      )}
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div
        className={`text-lg font-bold font-mono ${highlight ? "text-accent" : "text-primary"} ${highlight ? "" : "glow-text"}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
