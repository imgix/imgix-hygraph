'use client';

import { Wrapper } from '@hygraph/app-sdk-react';
import { type PropsWithChildren } from 'react';

type HygraphProvider = PropsWithChildren;

const HygraphProvider = ({ children }: HygraphProvider) => {
  return <Wrapper>{children}</Wrapper>;
};

export { HygraphProvider };
