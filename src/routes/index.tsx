import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TreeExplorer } from "@/components/TreeExplorer";
import { fetchSwapiTree } from "@/lib/swapi";
import type { TreeNode } from "@/lib/tree";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SWAPI Tree — Árvore Interativa Star Wars" },
      { name: "description", content: "Visualização interativa de dados da Star Wars API em estrutura de árvore com caminhamentos, busca, inserção e exclusão." },
    ],
  }),
  component: Index,
});

function Index() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSwapiTree()
      .then(setTree)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🌌</div>
          <h2 className="text-lg font-bold text-primary glow-text tracking-wider">
            Carregando a Galáxia...
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Buscando planetas e residentes da SWAPI
          </p>
        </div>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-bold text-destructive">Erro ao carregar dados</h2>
          <p className="text-xs text-muted-foreground mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return <TreeExplorer initialTree={tree} />;
}
