import React from 'react';
import { Alert, Container, SimpleGrid } from '@chakra-ui/react';
import { ItemCard } from './ItemCard';

export const ItemCards = (props) => {
  return !props.items ? (
    <></>
  ) : props.items.length === 0 ? (
    <Alert status="info" colorScheme="gray.50">
      展示されている NFT はありません。
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
