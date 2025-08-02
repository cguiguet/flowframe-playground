/**
 * A simplified expression resolver inspired by n8n.
 * It replaces placeholders like `{{ $json.some.key }}` in a string
 * with values from a given data item.
 *
 * @param {string} templateString The string containing expressions.
 * @param {any} item The data item context, expected to have a `json` property.
 * @returns {string} The resolved string.
 */
export function resolveExpression(templateString: string, item: any): string {
    // If there's no item context, return the original string
    if (!item || typeof item.json !== 'object') {
      return templateString;
    }
  
    // Regex to find expressions like {{ $json.key }} or {{ $json.nested.key }}
    const expressionRegex = /{{\s*\$json\.([\w.]+)\s*}}/g;
  
    return templateString.replace(expressionRegex, (match, keyPath) => {
      const keys = keyPath.split('.');
      let currentValue = item.json;
  
      // Traverse the nested object to find the value
      for (const key of keys) {
        if (currentValue && typeof currentValue === 'object' && key in currentValue) {
          currentValue = currentValue[key];
        } else {
          // If the path is invalid, return the original placeholder
          return match;
        }
      }
  
      // If the final value is an object, stringify it
      if (typeof currentValue === 'object' && currentValue !== null) {
        return JSON.stringify(currentValue);
      }
  
      // Return the found value as a string
      return String(currentValue);
    });
  }