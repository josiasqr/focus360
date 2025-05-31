import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoHelloViewProps } from './ExpoHello.types';

const NativeView: React.ComponentType<ExpoHelloViewProps> =
  requireNativeView('ExpoHello');

export default function ExpoHelloView(props: ExpoHelloViewProps) {
  return <NativeView {...props} />;
}
