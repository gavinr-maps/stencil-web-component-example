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
  if (amd) {
    return requireModule(`esri/${relativeModulePath}`);
  }

  /**
   * @see https://webpack.js.org/api/module-methods/#webpackignore
   */
  const module = await import(/* webpackIgnore: true */ `@arcgis/core/${relativeModulePath}`);
  if (module.default) {
    return module.default;
  }
  return module;
}
