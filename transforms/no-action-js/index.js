const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  const root = j(file.source);

  // Ensure the `action` import is present
  const importDeclarations = root.find(j.ImportDeclaration, {
    source: { value: '@ember/object' },
  });

  const hasActionImport = importDeclarations.some((path) => {
    return path.node.specifiers.some(
      (specifier) => specifier.imported && specifier.imported.name === 'action'
    );
  });

  if (!hasActionImport) {
    let shouldAddImport = false;

    root.find(j.ObjectExpression).forEach((path) => {
      const properties = path.node.properties;

      for (let i = properties.length - 1; i >= 0; i--) {
        const property = properties[i];

        if (
          property.key &&
          property.key.name === 'actions' &&
          property.value &&
          property.value.type === 'ObjectExpression'
        ) {
          shouldAddImport = true;
        }
      }
    });

    if (shouldAddImport) {
      const emberObjectImport = importDeclarations.at(0);

      if (emberObjectImport.size() > 0) {
        // Add `action` to existing import from '@ember/object'
        emberObjectImport.get().node.specifiers.push(
          j.importSpecifier(j.identifier('action'))
        );
      } else {
        // Add a new import declaration for `action` at the end of other imports
        const lastImportIndex = root.find(j.ImportDeclaration).size() - 1;
        
        let dec = j.importDeclaration(
          [j.importSpecifier(j.identifier('action'))],
          j.literal('@ember/object')
        );

        if (lastImportIndex === -1) {
          // No existing import declarations, add at the beginning
          root.get().node.program.body.unshift(
            dec
          );
        } else {
          root.find(j.ImportDeclaration).at(lastImportIndex).insertAfter(
            dec
          );
        }
      }
    }
  }

  return root
    .find(j.ObjectExpression)
    .forEach((path) => {
      const properties = path.node.properties;
      const existingKeys = new Set(properties.map((prop) => prop.key.name));

      for (let i = properties.length - 1; i >= 0; i--) {
        const property = properties[i];

        if (
          property.key &&
          property.key.name === 'actions' &&
          property.value &&
          property.value.type === 'ObjectExpression'
        ) {
          // Extract methods from the `actions` object and add them to the parent object
          const actionProperties = property.value.properties.map((actionProperty) => {
            let keyName = actionProperty.key.name;

            if (existingKeys.has(keyName)) {
              keyName = `${keyName}Action`;
            }

            existingKeys.add(keyName);

            if (actionProperty.type === 'ObjectMethod') {
              // Convert ObjectMethod to FunctionExpression
              const functionExpression = j.functionExpression(
                null,
                actionProperty.params,
                actionProperty.body
              );

              return j.objectProperty(
                j.identifier(keyName),
                j.callExpression(j.identifier('action'), [functionExpression])
              );
            } else if (
              actionProperty.value &&
              (actionProperty.value.type === 'FunctionExpression' ||
                actionProperty.value.type === 'ArrowFunctionExpression')
            ) {
              // Wrap FunctionExpression or ArrowFunctionExpression in the `action` helper
              return j.objectProperty(
                j.identifier(keyName),
                j.callExpression(j.identifier('action'), [actionProperty.value])
              );
            }
            return actionProperty;
          });

          // Remove the `actions` property and add its methods to the parent object
          properties.splice(i, 1, ...actionProperties);
        }
      }
    })
    .toSource();
};

module.exports.type = 'js';