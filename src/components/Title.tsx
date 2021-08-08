import React from 'react';
import { Flex, Image } from '@chakra-ui/react';

export const Title = () => (
  <Flex justifyContent="center" alignItems="center" height="12vh" m={4}>
    <Image src="/logo.png" alt="Make! NFT" height="100px" mt={8} mb={6} />
  </Flex>
);
