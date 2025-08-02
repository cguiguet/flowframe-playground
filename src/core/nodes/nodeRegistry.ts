/**
 * Ce fichier agit comme un registre dynamique pour tous les nœuds de l'application.
 * Il utilise la fonction d'importation "glob" de Vite pour découvrir et traiter
 * automatiquement tous les fichiers de définition et d'exécution.
 */

// 1. Découverte des fichiers de DÉFINITION (chargés immédiatement)
const definitionModules = import.meta.glob('./**/!(*.test).definition.ts', { eager: true });

// 2. Découverte des fichiers d'EXÉCUTION (chargés à la demande)
// On n'utilise PAS `eager: true` ici. Vite nous donne une fonction qui importera le module quand on l'appellera.
const executorModules = import.meta.glob('./**/!(*.test).executor.ts');

/**
 * Crée un map des "chargeurs" d'exécuteurs.
 * La clé est le nom de base du fichier (ex: 'StartNode'), et la valeur est la fonction `() => import(...)`.
 * Cela permet de trouver et charger le bon exécuteur de manière paresseuse (lazy-loading).
 */
const executorLoaders = new Map<string, () => Promise<any>>();
for (const path in executorModules) {
  // Extrait le nom du dossier/fichier (ex: 'StartNode' depuis './StartNode/StartNode.executor.ts')
  const match = path.match(/.*\/(.*?)\/\1\.executor\.ts$/);
  if (match && match[1]) {
    const nodeTypeName = match[1];
    executorLoaders.set(nodeTypeName, executorModules[path] as () => Promise<any>);
  }
}

/**
 * Traite toutes les définitions trouvées pour les préparer à l'exportation.
 */
export const allNodeDefinitions = Object.entries(definitionModules).map(([path, module]) => {
  const definition = (module as any)[Object.keys(module as any)[0]];
  // Extrait le nom de base du chemin du fichier de définition.
  const match = path.match(/.*\/(.*?)\/\1\.definition\.ts$/);
  const baseName = (match && match[1]) || '';
  return { ...definition, baseName }; // On ajoute le nom de base à la définition
});

/**
 * Un map des types de nœuds vers leurs composants React correspondants.
 */
export const nodeTypes = Object.fromEntries(
  allNodeDefinitions.map(def => [def.type, def.component])
);

/**
 * Un tableau de métadonnées de nœuds pour l'affichage dans la barre latérale.
 */
export const nodeLibrary = allNodeDefinitions.map(def => ({
  type: def.type,
  label: def.library.label,
  description: def.library.description,
  category: def.library.category,
}));

/**
 * Un map des types de nœuds vers leurs composants de configuration UI.
 */
export const nodeConfigurationPanels = Object.fromEntries(
  allNodeDefinitions
    .filter(def => def.configurationComponent)
    .map(def => [def.type, def.configurationComponent])
);

/**
 * Un map des types de nœuds vers leurs fonctions d'exécution.
 * C'est la partie la plus importante qui a été corrigée.
 */
export const nodeExecutors = Object.fromEntries(
  allNodeDefinitions.map(def => [
    def.type, 
    {
      execute: async (...args: any[]) => {
        // On cherche le "chargeur" correspondant au nom de base du nœud
        const loader = executorLoaders.get(def.baseName);
        if (!loader) {
          throw new Error(`Executor for node type "${def.type}" (baseName: "${def.baseName}") not found.`);
        }
        // On appelle la fonction `import()` que Vite nous a préparée
        const executorModule = await loader();
        return executorModule.execute(...args);
      }
    }
  ])
);