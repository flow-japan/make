import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useTranslation } from 'next-i18next';
import { ItemCards } from './ItemCards';
import { flow } from '../services/flow';

export const ViewShowcase = (props) => {
  const { t } = useTranslation('common');
  const [nftsData, setNftsData] = useState(null);

  const updateNftsData = async () => {
    const result = await flow.getShowcaseAllMetadata();
    setNftsData(result);
  };

  return (
    <>
      <Button size="sm" mt="2" mb="4" onClick={updateNftsData}>
        {!nftsData ? t('button.view') : <RepeatIcon />}
      </Button>
      <ItemCards items={nftsData} user={props.user} />
    </>
  );
};
