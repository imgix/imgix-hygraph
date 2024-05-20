import { useApp } from '@hygraph/app-sdk-react';
import { useMemo } from 'react';
import { z } from 'zod';

export const configSchema = z.object({
  imgixBase: z.string().min(1).default(''),
  imgixToken: z.string().optional().default(''),
  imgixSourceId: z.string().optional().default(''),
  imgixSourceType: z.enum(['webfolder', 'other']).optional().default('webfolder')
});

export type AppConfig = z.infer<typeof configSchema>;

export const useAppConfig = () => {
  const { installation } = useApp();

  const config = useMemo(() => {
    return configSchema.parse(installation.config);
  }, [installation.config]);

  return config;
};
