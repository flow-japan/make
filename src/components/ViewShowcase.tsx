import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { ItemCards } from './ItemCards';
import { flow } from '../services/flow';

export const ViewShowcase = () => {
  const [nftsData, setNftsData] = useState(null);

  const updateNftsData = async () => {
    const result = await flow.getAllMetadata();
    setNftsData(result);
  };

  return (
    <>
      <Button m={2} size="sm" onClick={updateNftsData}>
        {!nftsData ? 'みる' : <RepeatIcon />}
      </Button>
      <ItemCards items={nftsData} />
    </>
  );
};
