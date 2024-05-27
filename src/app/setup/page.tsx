'use client';

import { useUpdateAppConfig } from '@/app/setup/useUpdateAppConfig';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { configSchema, useAppConfig } from '@/hooks/useAppConfig';
import { Select } from '@headlessui/react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HygraphIcon from '/public/hygraph-icon.svg';
import ExteralLinkIcon from '/public/icons/external-link.svg';
import ImgixIcon from '/public/imgix-icon.png';

const SetupPage = () => {
  const config = useAppConfig();
  const { t } = useTranslation();

  const [imgixBase, setImgixBase] = useState(config.imgixBase);
  const [imgixToken, setImgixToken] = useState(config.imgixToken);
  const [imgixSourceId, setImgixSourceId] = useState(config.imgixSourceId);
  const [imgixSourceType, setImgixSourceType] = useState(config.imgixSourceType);

  const newConfig = {
    imgixBase,
    imgixToken,
    imgixSourceId,
    imgixSourceType
  };

  const { isUpdatingConfig, updateConfig, isConfigUpdateError, configUpdateError } = useUpdateAppConfig();

  const isConfigValid = useMemo(() => {
    const { success } = configSchema.safeParse(newConfig);
    return success;
  }, [imgixBase, imgixToken]);

  const isButtonDisabled = !isConfigValid;

  return (
    <div className="max-w-md space-y-24">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Image src={ImgixIcon} alt="imgix logo" height={48} />
          <span className="text-3xl">+</span>
          <HygraphIcon className="h-48" />
        </div>

        <p className="leading-normal text-slate-700">{t('setup.description')}</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm">
          <p>{t('setup.sourceType.label')}</p>
          <p className="flex text-xs text-slate-500">
            <a href="https://docs.imgix.com/setup/creating-sources" target="_blank" rel="noreferrer">
              <span>{t('setup.sourceType.hint')}</span>
              <ExteralLinkIcon className="ml-1 inline-block h-4 w-4" />
            </a>
          </p>
        </label>
        <Select
          value={imgixSourceType}
          onChange={(e) => setImgixSourceType(e.target.value as 'hygraph-webfolder' | 'other')}
          className="h-10 w-full rounded-sm border border-slate-300 px-3 text-black"
        >
          <option value="hygraph-webfolder">Webfolder</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-sm">
          <p>{t('setup.baseUrl.label')}</p>
          <p className="text-xs text-slate-500">{t('setup.requiredField')}</p>
        </label>
        <Input
          value={imgixBase}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImgixBase(e.target.value)}
          required
        />
      </div>

      {imgixSourceType === 'other' ? (
        <>
          <div className="space-y-1">
            <label className="text-sm">
              <p>{t('setup.apiKey.label')}</p>
              <p className="flex text-xs text-slate-500">{t('setup.apiKey.hint')}</p>
            </label>
            <Input
              value={imgixToken}
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImgixToken(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">
              <p>{t('setup.sourceId.label')}</p>
              <p className="flex text-xs text-slate-500">{t('setup.sourceId.hint')}</p>
            </label>
            <Input
              value={imgixSourceId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImgixSourceId(e.target.value)}
            />
          </div>
        </>
      ) : null}

      {isConfigUpdateError && configUpdateError ? (
        <p className="text-m text-red-500">
          {t('setup.error')}: {configUpdateError.message}
        </p>
      ) : null}

      <Button
        onClick={() => updateConfig(newConfig)}
        disabled={isButtonDisabled || isUpdatingConfig}
        loading={isUpdatingConfig}
        loadingText={t('setup.saveButtonLoadingLabel')}
      >
        {t('setup.saveButtonLabel')}
      </Button>
    </div>
  );
};

export default SetupPage;
