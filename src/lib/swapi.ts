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
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : url;
}

const BASE = "https://swapi.tech/api";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

interface SwapiTechPlanetList {
  results: { uid: string; name: string; url: string }[];
}

interface SwapiTechPlanetDetail {
  result: {
    properties: {
      name: string;
      climate: string;
      terrain: string;
      population: string;
      residents: string[];
      url: string;
    };
    uid: string;
  };
}

interface SwapiTechPersonDetail {
  result: {
    properties: {
      name: string;
      birth_year: string;
      gender: string;
      url: string;
    };
    uid: string;
  };
}

export async function fetchSwapiTree(): Promise<TreeNode> {
  // Fetch planet list (first 15)
  const list = await fetchJson<SwapiTechPlanetList>(`${BASE}/planets?page=1&limit=15`);

  // Fetch details for each planet
  const planetDetails = await Promise.all(
    list.results.map((p) =>
      fetchJson<SwapiTechPlanetDetail>(`${BASE}/planets/${p.uid}`).catch(() => null)
    )
  );

  const validPlanets = planetDetails
    .filter((d): d is SwapiTechPlanetDetail => d !== null)
    .filter((d) => d.result.properties.residents && d.result.properties.residents.length > 0)
    .slice(0, 8);

  // If swapi.tech doesn't return resident URLs in planet details, fallback to
  // a known set. swapi.tech sometimes omits nested URLs.
  const planetNodes: TreeNode[] = await Promise.all(
    validPlanets.map(async (detail) => {
      const props = detail.result.properties;
      const residentUrls = (props.residents || []).slice(0, 5);

      const residentNodes: TreeNode[] = [];
      for (const url of residentUrls) {
        try {
          const person = await fetchJson<SwapiTechPersonDetail>(url);
          residentNodes.push({
            id: `person-${person.result.uid}`,
            name: person.result.properties.name,
            type: "resident" as const,
            data: {
              birth_year: person.result.properties.birth_year,
              gender: person.result.properties.gender,
            },
            children: [],
          });
        } catch {
          // skip failed resident fetches
        }
      }

      return {
        id: `planet-${detail.result.uid}`,
        name: props.name,
        type: "planet" as const,
        data: { climate: props.climate, terrain: props.terrain, population: props.population },
        children: residentNodes,
      };
    })
  );

  // If no planets had residents (API limitation), create tree with all planets as leaves
  const finalPlanetNodes = planetNodes.length > 0
    ? planetNodes
    : planetDetails
        .filter((d): d is SwapiTechPlanetDetail => d !== null)
        .slice(0, 10)
        .map((d) => ({
          id: `planet-${d.result.uid}`,
          name: d.result.properties.name,
          type: "planet" as const,
          data: {
            climate: d.result.properties.climate,
            terrain: d.result.properties.terrain,
            population: d.result.properties.population,
          },
          children: [],
        }));

  return {
    id: "root",
    name: "Star Wars Galaxy",
    type: "root",
    children: finalPlanetNodes,
  };
}
