import { useApp } from '@hygraph/app-sdk-react';
import { useMemo } from 'react';
import { z } from 'zod';

const configSchema = z.object({
  imgixBase: z.string().trim().url(),
  imgixToken: z.string().optional().default(''),
  imgixSourceId: z.string().optional().default(''),
  imgixSourceType: z.enum(['hygraph-webfolder', 'other']).optional().default('hygraph-webfolder')
});

export type AppConfig = z.infer<typeof configSchema>;

export const useAppConfig = () => {
  const { installation } = useApp();

  const config = useMemo(() => {
    return configSchema.safeParse(installation.config);
  }, [installation.config]);

  if (config.success) {
    return config.data;
  }

  return {
    imgixBase: 'https://',
    imgixToken: '',
    imgixSourceId: '',
    imgixSourceType: 'hygraph-webfolder'
  } as const;
};
