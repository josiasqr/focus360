// Reexport the native module. On web, it will be resolved to ExpoHelloModule.web.ts
// and on native platforms to ExpoHelloModule.ts
export { default } from './src/ExpoHelloModule';
export { default as ExpoHelloView } from './src/ExpoHelloView';
export * from  './src/ExpoHello.types';
