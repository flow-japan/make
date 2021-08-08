import React from 'react';
import { Text, Container, SimpleGrid } from '@chakra-ui/react';
import { ItemCard } from './ItemCard';

export const ItemCards = (props) => {
  return !props.items ? (
    <Container ml={0} mr={4} mt={4} maxWidth="3xl"></Container>
  ) : props.items.length === 0 ? (
    <Container ml={0} mr={4} mt={4} maxWidth="3xl">
      <Text as="kbd" ml={4} mt={8}>
        There is no NFT. Let's mint in [CREATE] tab.
      </Text>
    </Container>
  ) : (
    <Container ml={0} mr={4} mt={12} maxWidth="3xl">
      <SimpleGrid minChildWidth="120px" spacing="10px">
        {props.items
          ? props.items.map((item, index) => {
              return <ItemCard key={index} item={item} />;
            })
          : null}
      </SimpleGrid>
    </Container>
  );
};
