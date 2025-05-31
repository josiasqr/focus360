import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoHello.types';

type ExpoHelloModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoHelloModule extends NativeModule<ExpoHelloModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoHelloModule);
