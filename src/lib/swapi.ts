import type { TreeNode } from "./tree";

interface SwapiPlanet {
  name: string;
  climate: string;
  terrain: string;
  population: string;
  residents: string[];
  url: string;
}

interface SwapiPerson {
  name: string;
  birth_year: string;
  gender: string;
  url: string;
}

function extractId(url: string): string {
  const match = url.match(/\/(\d+)\/$/);
  return match ? match[1] : url;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchSwapiTree(): Promise<TreeNode> {
  // Fetch first 3 pages of planets (30 planets max)
  const pages = await Promise.all([
    fetchJson<{ results: SwapiPlanet[] }>("https://swapi.dev/api/planets/?page=1"),
    fetchJson<{ results: SwapiPlanet[] }>("https://swapi.dev/api/planets/?page=2"),
  ]);
  
  const allPlanets = pages.flatMap((p) => p.results);
  // Pick planets that have residents, limit to 8
  const planetsWithResidents = allPlanets.filter((p) => p.residents.length > 0).slice(0, 8);

  const planetNodes: TreeNode[] = await Promise.all(
    planetsWithResidents.map(async (planet) => {
      const residentUrls = planet.residents.slice(0, 5); // limit residents per planet
      const residents = await Promise.all(
        residentUrls.map((url) => fetchJson<SwapiPerson>(url).catch(() => null))
      );

      const residentNodes: TreeNode[] = residents
        .filter((r): r is SwapiPerson => r !== null)
        .map((r) => ({
          id: `person-${extractId(r.url)}`,
          name: r.name,
          type: "resident" as const,
          data: { birth_year: r.birth_year, gender: r.gender },
          children: [],
        }));

      return {
        id: `planet-${extractId(planet.url)}`,
        name: planet.name,
        type: "planet" as const,
        data: { climate: planet.climate, terrain: planet.terrain, population: planet.population },
        children: residentNodes,
      };
    })
  );

  return {
    id: "root",
    name: "Star Wars Galaxy",
    type: "root",
    children: planetNodes,
  };
}
