import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';

export const Title = ({ title }) => (
  <Flex justifyContent="center" alignItems="center" height="10vh" m={4}>
    <Heading
      fontSize="6vw"
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      bgClip="text"
    >
      {title}
    </Heading>
  </Flex>
);

Title.defaultProps = {
  title: "Let's mint on Flow 🌊",
};
