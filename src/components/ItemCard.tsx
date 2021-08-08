import React from 'react';
import {
  Box,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';

export const ItemCard = (props) => {
  const { id, name, description, image } = props.item;
  return (
    <Box
      role={'group'}
      p={6}
      maxW={'380px'}
      maxH={'600px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      pos={'relative'}
      zIndex={1}
    >
      <Box
        rounded={'lg'}
        mt={-12}
        pos={'relative'}
        height={'180px'}
        _after={{
          transition: 'all .3s ease',
          content: '""',
          w: 'full',
          h: 'full',
          pos: 'absolute',
          top: 5,
          left: 0,
          backgroundImage: `url(${image})`,
          filter: 'blur(15px)',
          zIndex: -1,
        }}
        _groupHover={{
          _after: {
            filter: 'blur(20px)',
          },
        }}
      >
        <Image
          rounded={'lg'}
          height={180}
          width={342}
          objectFit={'cover'}
          src={image}
        />
      </Box>
      <Stack pt={10} align={'center'}>
        <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
          #{id}
        </Text>
        <Heading
          fontSize={'2xl'}
          fontFamily={'body'}
          fontWeight={500}
          noOfLines={3}
        >
          {name}
        </Heading>
        <Stack direction={'row'} align={'center'}>
          <Text color={'gray.600'} noOfLines={4} fontSize="sm">
            {description}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};
