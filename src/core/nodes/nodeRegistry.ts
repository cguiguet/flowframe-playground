/**
 * Ce fichier agit comme un registre dynamique pour tous les nœuds de l'application.
 * Il utilise la fonction d'importation "glob" de Vite pour découvrir et traiter
 * automatiquement tous les fichiers de définition de nœuds.
 */

// Importe tous les fichiers `*.definition.ts` de manière "eager" (immédiate).
const nodeDefinitionModules = import.meta.glob('./**/!(*.test).definition.ts', { eager: true });

// Extrait l'objet de définition de chaque module importé.
const allNodeDefinitions = Object.values(nodeDefinitionModules).map((module: any) => {
  return module[Object.keys(module)[0]];
});

/**
 * Un map des types de nœuds vers leurs composants React correspondants.
 * Consommé directement par le composant <ReactFlow />.
 * Exemple: { process: ProcessNodeComponent, slack: SlackNodeComponent }
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
  category: def.library.category,
}));

/**
 * Un map des types de nœuds vers leurs composants de configuration UI.
 * Sera utilisé par le panneau de configuration principal pour afficher le bon formulaire.
 */
export const nodeConfigurationPanels = Object.fromEntries(
  allNodeDefinitions
    // On ne garde que les nœuds qui ont un composant de configuration défini.
    .filter(def => def.configurationComponent)
    .map(def => [def.type, def.configurationComponent])
);

/**
 * Un map des types de nœuds vers leurs fonctions d'exécution.
 * Utilisé par le flow-executor pour exécuter la logique de chaque nœud.
 * L'importation dynamique permet de ne charger le code d'exécution que lorsque c'est nécessaire.
 */
export const nodeExecutors = Object.fromEntries(
  allNodeDefinitions.map(def => [
    def.type, 
    {
      execute: async (...args: any[]) => {
        // Le chemin est construit dynamiquement basé sur le nom du composant.
        // Cela suppose une convention de nommage cohérente.
        const executorModule = await import(`./${def.component.name}/${def.component.name}.executor.ts`);
        return executorModule.execute(...args);
      }
    }
  ])
);