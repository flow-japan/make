import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { ItemTable } from './ItemTable';
import { flow } from '../services/flow';

export const ViewCollection = () => {
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
      <ItemTable items={nftsData} />
    </>
  );
};
