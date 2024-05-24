declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';
  const ReactComponent: (props: SVGProps<SVGElement>) => ReactElement;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const content: any;
  export default content;
}
