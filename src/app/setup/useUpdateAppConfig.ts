import { AppConfig } from '@/hooks/useAppConfig';
import { useApp } from '@hygraph/app-sdk-react';
import { useMutation } from '@tanstack/react-query';

const useUpdateAppConfig = () => {
  const app = useApp();

  const mutationFn = (appConfig: AppConfig) =>
    app.updateInstallation({
      status: 'COMPLETED',
      config: appConfig
    });

  const { mutate, isPending, isError, error } = useMutation({ mutationFn });

  return {
    isUpdatingConfig: isPending,
    updateConfig: mutate,
    isConfigUpdateError: isError,
    configUpdateError: error
  };
};

export { useUpdateAppConfig };
