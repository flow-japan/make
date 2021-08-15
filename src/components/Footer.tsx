import React from 'react';
import {
  Image,
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

const Logo = () => {
  return (
    <Link href="https://www.doublejump.tokyo" isExternal>
      <Image src="/djt-logo.png" alt="double jump.tokyo" height="50px" />
    </Link>
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
      <Container as={Stack} maxW={'6xl'} py={4} spacing={4} align={'center'}>
        <Text as="kbd" fontSize="small" textColor="gray.600">
          © 2021&nbsp;
          <Link href="http://avcd.hns.to/" isExternal>
            avcd
          </Link>
        </Text>
        <Stack
          direction={'row'}
          spacing={2}
          justify={'center'}
          align={'center'}
        >
          <Text as="kbd" fontSize="small" pb={-6} textColor="gray.600">
            Sponsored by
          </Text>
          <Logo />
        </Stack>
      </Container>
    </Box>
  );
};
