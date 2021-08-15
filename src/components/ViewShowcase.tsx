import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { ItemCards } from './ItemCards';
import { flow } from '../services/flow';

export const ViewShowcase = (props) => {
  const [nftsData, setNftsData] = useState(null);

  const updateNftsData = async () => {
    const result = await flow.getShowcaseAllMetadata();
    setNftsData(result);
  };

  return (
    <>
      <Button size="sm" mt="2" mb="4" onClick={updateNftsData}>
        {!nftsData ? 'みる' : <RepeatIcon />}
      </Button>
      <ItemCards items={nftsData} user={props.user} />
    </>
  );
};
