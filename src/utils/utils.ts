const amd = 'define' in window && typeof window.define === 'function' && 'amd' in window.define;
function requireModule<T>(modulePath: string): Promise<T> {
  return new Promise<T>(resolve =>
    (window as any).require([modulePath], (moduleDefault: T) => {
      resolve(moduleDefault);
    }),
  );
}

export async function importEsri(modulePath: string): Promise<any> {
  const relativeModulePath = modulePath.replace(/^(@arcgis\/core\/|esri\/)/, '');

  /**
   * Removes the partial path information from the import statement, thus
   * preventing webpack from bundling the entire Esri library.
   * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
   */
  const fullModulePath = `${amd ? 'esri' : '@arcgis/core'}/${relativeModulePath}`;
  if (amd) {
    return requireModule(fullModulePath);
  }

  /**
   * @see https://webpack.js.org/api/module-methods/#webpackignore
   */
  const module = await import(/* webpackIgnore: true */ fullModulePath);
  if (module.default) {
    return module.default;
  }
  return module;
}
