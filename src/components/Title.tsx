import React from 'react';
import { Flex, Image } from '@chakra-ui/react';

export const Title = () => (
  <Flex minW="200px" justifyContent="center" alignItems="center">
    <Image src="/logo.png" alt="Make! NFT" height="100px" mt={6} mb={2} />
  </Flex>
);
