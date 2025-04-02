module.exports = function ({ source /*, path*/ }, { parse, visit }) {
  const ast = parse(source);

  return visit(ast, (env) => {
    let { builders: b } = env.syntax;

    return {
      MustacheStatement(node) {
        if (node.path.original === 'action') {
          const firstParam = node.params[0];
          const secondParam = node.params[1];

          if (firstParam.type === 'StringLiteral' && secondParam) {
            // Transform {{action "methodName" param}} to {{fn this.methodName param}}
            return b.mustache(b.path('fn'), [
              b.path(`this.${firstParam.value}`),
              ...node.params.slice(1)
            ]);
          } else if (firstParam.type === 'StringLiteral') {
            // Transform {{action "methodName"}} to this.methodName
            return b.mustache(b.path(`this.${firstParam.value}`));
          } else if (secondParam) {
            // Transform {{action this.method param}} to {{fn this.method param}}
            return b.mustache(b.path('fn'), node.params);
          } else {
            // Transform {{action this.method}} to {{this.method}}
            return b.mustache(firstParam);
          }
        }
      },

      SubExpression(node) {
        if (node.path.original === 'action') {
          const firstParam = node.params[0];
          const secondParam = node.params[1];

          if (firstParam.type === 'StringLiteral' && secondParam) {
            // Transform (action "methodName" param) to (fn this.methodName param)
            return b.sexpr(b.path('fn'), [
              b.path(`this.${firstParam.value}`),
              ...node.params.slice(1)
            ]);
          } else if (firstParam.type === 'StringLiteral') {
            // Transform (action "methodName") to this.methodName
            return b.path(`this.${firstParam.value}`);
          } else if (secondParam) {
            // Transform (action this.method param) to (fn this.method param)
            return b.sexpr(b.path('fn'), node.params);
          } else {
            // Transform (action this.method) to this.method
            return b.path(firstParam.original);
          }
        }
      }
    };
  });
};

module.exports.type = 'hbs';
