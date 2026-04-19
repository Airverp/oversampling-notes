import { moduleDefinitions, papers, type ModuleDefinition, type ModuleKey, type PaperEntry } from '../data/papers';

export function getAllPapers() {
  return [...papers].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getPaperById(id: string) {
  return papers.find((paper) => paper.id === id);
}

export function getAllModules() {
  return moduleDefinitions;
}

export function getModuleBySlug(slug: string) {
  return moduleDefinitions.find((module) => module.slug === slug);
}

export function getModuleByKey(key: ModuleKey) {
  return moduleDefinitions.find((module) => module.key === key);
}

export function getPapersByModule(key: ModuleKey) {
  return getAllPapers().filter((paper) => paper.modules.some((module) => module.key === key));
}

export function getAllKeywords() {
  return [...new Set(papers.flatMap((paper) => paper.keywords))].sort((a, b) => a.localeCompare(b));
}

export function getAllYears() {
  return [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a);
}

export function countPapersByModule(key: ModuleKey) {
  return getPapersByModule(key).length;
}

export function getFeaturedPapers(limit = 3): PaperEntry[] {
  return getAllPapers().slice(0, limit);
}

export function buildModuleHighlights(paper: PaperEntry) {
  return paper.modules.map((module) => ({
    ...module,
    definition: getModuleByKey(module.key) as ModuleDefinition,
  }));
}
