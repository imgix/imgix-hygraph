'use client';

import { useUpdateAppConfig } from '@/app/setup/useUpdateAppConfig';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Select } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import HygraphIcon from '/public/hygraph-icon.svg';
import ChevronDownIcon from '/public/icons/chevron-down.svg';
import ExteralLinkIcon from '/public/icons/external-link.svg';
import ImgixIcon from '/public/imgix-icon.png';

const schema = z.union([
  z.object({
    imgixSourceType: z.literal('hygraph-webfolder'),
    imgixBase: z
      .string()
      .min(1, { message: 'Required' })
      .trim()
      .url({ message: 'Invalid URL. Provide the full URL, including the protocol (e.g. https://)' })
  }),
  z.object({
    imgixSourceType: z.literal('other'),
    imgixBase: z
      .string()
      .min(1, { message: 'Required' })
      .trim()
      .url({ message: 'Invalid URL. Provide the full URL, including the protocol (e.g. https://)' }),
    imgixToken: z.string().min(1, { message: 'Required' }),
    imgixSourceId: z.string().min(1, { message: 'Required' })
  })
]);

const listImgixSource = async (token: string, sourceId: string) => {
  const response = await fetch(`https://api.imgix.com/api/v1/sources/${sourceId}/assets`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.status;
};

const SetupPage = () => {
  const config = useAppConfig();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: config
  });

  const { isUpdatingConfig, updateConfig, isConfigUpdateError, configUpdateError } = useUpdateAppConfig();

  const isLoading = isSubmitting || isUpdatingConfig;
  const blockSubmit = isLoading;

  return (
    <form
      className="max-w-md space-y-24"
      onSubmit={handleSubmit(async (data) => {
        if (data.imgixSourceType === 'other') {
          const sourceListResult = await listImgixSource(data.imgixToken, data.imgixSourceId);

          if (sourceListResult === 401) {
            setError('imgixToken', { message: 'API key is invalid' });
            return;
          }

          if (sourceListResult === 403) {
            setError('imgixToken', { message: 'API key is missing required permissions' });
            return;
          }

          if (sourceListResult === 404) {
            setError('imgixSourceId', { message: 'Source ID is invalid' });
            return;
          }

          if (sourceListResult !== 200) {
            setError('imgixToken', { message: 'Unknown error validating API key' });
            return;
          }
        }

        updateConfig(data);
      })}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Image src={ImgixIcon} alt="imgix logo" height={48} />
          <span className="text-3xl">+</span>
          <HygraphIcon className="h-48" />
        </div>

        <p className="leading-normal text-slate-700">
          This app allows you to easily use imgix assets in Hygraph. For more information about configuring the app, see
          our{' '}
          <a
            className="text-black underline"
            href="https://docs.imgix.com/libraries#plugins"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>documentation</span>
            <ExteralLinkIcon className="ml-1 inline-block size-5" />
          </a>
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm">
          <p>{t('setup.sourceType.label')}</p>
          <p className="flex text-xs text-slate-500">
            <a href="https://docs.imgix.com/setup/creating-sources" target="_blank" rel="noreferrer">
              <span>{t('setup.sourceType.hint')}</span>
              <ExteralLinkIcon className="ml-1 inline-block size-4" />
            </a>
          </p>
        </label>
        <div className="relative">
          <Select
            className="h-10 w-full appearance-none rounded-sm border border-slate-300 px-3 text-black"
            {...register('imgixSourceType')}
          >
            <option value="hygraph-webfolder">Webfolder</option>
            <option value="other">Other</option>
          </Select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-3 size-4" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm">
          <p>{t('setup.baseUrl.label')}</p>
          <p className="text-xs text-slate-500">{t('setup.requiredField')}</p>
        </label>
        <Input {...register('imgixBase')} />
        {errors.imgixBase ? <p className="text-sm text-red-500">{errors.imgixBase.message}</p> : null}
      </div>

      {watch('imgixSourceType') === 'other' ? (
        <>
          <div className="space-y-1">
            <label className="text-sm">
              <p>{t('setup.apiKey.label')}</p>
              <p className="flex text-xs text-slate-500">{t('setup.apiKey.hint')}</p>
            </label>
            <Input type="password" {...register('imgixToken')} />
            {errors.imgixToken ? <p className="text-sm text-red-500">{errors.imgixToken.message}</p> : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm">
              <p>{t('setup.sourceId.label')}</p>
              <p className="flex text-xs text-slate-500">{t('setup.sourceId.hint')}</p>
            </label>
            <Input {...register('imgixSourceId')} />
            {errors.imgixSourceId ? <p className="text-sm text-red-500">{errors.imgixSourceId.message}</p> : null}
          </div>
        </>
      ) : null}

      {isConfigUpdateError && configUpdateError ? (
        <p className="text-m text-red-500">
          {t('setup.error')}: {configUpdateError.message}
        </p>
      ) : null}

      <Button disabled={blockSubmit} loading={isLoading} loadingText={t('setup.saveButtonLoadingLabel')} type="submit">
        {t('setup.saveButtonLabel')}
      </Button>
    </form>
  );
};

export default SetupPage;
