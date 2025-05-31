import * as React from 'react';

import { ExpoHelloViewProps } from './ExpoHello.types';

export default function ExpoHelloView(props: ExpoHelloViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
