import React from 'react';
import { Alert, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { ItemCard } from './ItemCard';

export const ItemCards = (props) => {
  const { t } = useTranslation('common');

  return !props.items ? (
    <></>
  ) : props.items.length === 0 ? (
    <Alert status="info" colorScheme="gray.50">
      {t('no-showcase-nft-message')}
    </Alert>
  ) : (
    <SimpleGrid minChildWidth="160px" spacing="15px">
      {props.items
        ? props.items.map((item, index) => {
            return (
              <ItemCard
                key={index}
                item={item}
                myAddress={props.user ? props.user.addr : ''}
              />
            );
          })
        : null}
    </SimpleGrid>
  );
};
