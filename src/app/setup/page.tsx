'use client';

import { useUpdateAppConfig } from '@/app/setup/useUpdateAppConfig';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Box, Button, Input, Label } from '@hygraph/baukasten';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HygraphIcon from '../../../public/hygraph-icon.svg';
import ImgixIcon from '../../../public/imgix-icon.png';

const SetupPage = () => {
  const config = useAppConfig();
  const { t } = useTranslation();

  const [imgixBase, setImgixBase] = useState(config.imgixBase);

  const { isUpdatingConfig, updateConfig } = useUpdateAppConfig({ imgixBase });

  const isButtonDisabled = !imgixBase;

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
        <label className="text-sm">{t('setup.apiLabel')}</label>
        <Input value={imgixBase} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImgixBase(e.target.value)} />
      </div>

      <Button
        size="large"
        onClick={() => updateConfig({ imgixBase })}
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
