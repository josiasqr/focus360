import { NativeModule, requireNativeModule } from 'expo';

import { ExpoHelloModuleEvents } from './ExpoHello.types';

declare class ExpoHelloModule extends NativeModule<ExpoHelloModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoHelloModule>('ExpoHello');
