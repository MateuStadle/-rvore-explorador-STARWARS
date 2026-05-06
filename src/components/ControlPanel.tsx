import { useState } from "react";

interface ControlPanelProps {
  onTraversal: (type: "pre" | "in" | "post" | "bfs") => void;
  onSearch: (query: string) => void;
  onInsert: (parentId: string, name: string) => void;
  onDelete: (nodeId: string) => void;
  onClear: () => void;
  selectedNodeId: string | null;
  selectedNodeName: string | null;
  isRoot: boolean;
}

export function ControlPanel({
  onTraversal,
  onSearch,
  onInsert,
  onDelete,
  onClear,
  selectedNodeId,
  selectedNodeName,
  isRoot,
}: ControlPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [insertName, setInsertName] = useState("");

  const traversalButtons: { key: "pre" | "in" | "post" | "bfs"; label: string }[] = [
    { key: "pre", label: "Pré-ordem" },
    { key: "in", label: "Em-ordem" },
    { key: "post", label: "Pós-ordem" },
    { key: "bfs", label: "BFS" },
  ];

  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-4">
        {/* Traversals */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Caminhamento:
          </span>
          {traversalButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => onTraversal(btn.key)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Limpar
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-border" />

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(searchQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nó..."
            className="px-3 py-1.5 text-xs rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground w-36 focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-accent text-accent-foreground hover:opacity-80 transition-opacity"
          >
            Buscar
          </button>
        </form>

        {/* Separator */}
        <div className="w-px h-6 bg-border" />

        {/* Insert / Delete */}
        <div className="flex items-center gap-2">
          {selectedNodeId ? (
            <>
              <span className="text-xs text-muted-foreground">
                Selecionado: <strong className="text-foreground">{selectedNodeName}</strong>
              </span>
              <input
                type="text"
                value={insertName}
                onChange={(e) => setInsertName(e.target.value)}
                placeholder="Nome do filho"
                className="px-3 py-1.5 text-xs rounded-md bg-input border border-border text-foreground placeholder:text-muted-foreground w-32 focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={() => {
                  if (insertName.trim() && selectedNodeId) {
                    onInsert(selectedNodeId, insertName.trim());
                    setInsertName("");
                  }
                }}
                disabled={!insertName.trim()}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                + Inserir
              </button>
              {!isRoot && (
                <button
                  onClick={() => onDelete(selectedNodeId)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-destructive text-destructive-foreground hover:opacity-80 transition-opacity"
                >
                  ✕ Excluir
                </button>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Clique em um nó para inserir/excluir
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
