import React from 'react';
import {
  Image,
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const Logo = () => {
  return (
    <Image
      src="/djt-logo.png"
      alt="double jump.tokyo"
      height="50px"
      mt={8}
      mb={6}
    />
  );
};

export const Footer = () => {
  return (
    <Box
      width="100%"
      borderTopWidth={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        spacing={4}
        justify={'center'}
        align={'center'}
      >
        <Text as="kbd" fontSize="small" mb={-2} textColor="gray.600">
          © 2021 Flow Japan Community
        </Text>
        <Stack
          direction={'row'}
          spacing={6}
          justify={'center'}
          align={'center'}
        >
          <Text as="kbd" fontSize="small" mb={-2} textColor="gray.600">
            Sponsored by
          </Text>
          <Logo />
        </Stack>
      </Container>
    </Box>
  );
};
