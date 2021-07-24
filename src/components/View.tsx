import { useState, useEffect } from 'react';
import {
  Text,
  Container,
  SimpleGrid,
  Image,
  LinkBox,
  Stack,
  AspectRatio
} from '@chakra-ui/react';
import { flow } from '../services/flow';

export const View = props => {
  const [ nftsData, setNftsData ] = useState([]);

  const updateNftsData = async () => {
    const result = await flow.getCreatedCollectibleData();
    setNftsData(result);
  };

  useEffect(() => {
    updateNftsData();
  }, []);

  return !props.user || !props.user.loggedIn ? (
    <Text as="kbd" ml={4} mt={8}>Connect to the wallet by clicking [Connect] button in the upper right corner.</Text>
  ) : !nftsData || nftsData.length === 0 ? (
    <Text as="kbd" ml={4} mt={8}>There is no NFT. Let's mint in [CREATE] tab.</Text>
  ) : (
    <Container ml={0} mr={4} mt={4} maxWidth="3xl">
      <SimpleGrid columns={[1, 2, 4]}>
        {nftsData ? nftsData.map((data) => {
          return (
            <LinkBox>
              <Text my={2} fontSize="xs" as="kbd">#{data.id}</Text>
              <AspectRatio maxW="400px" ratio={1}>
                <Image src={data.image} alt={'#' + data.id} objectFit="cover" />
              </AspectRatio>
              <Stack align={{ base: "center", md: "stretch" }} textAlign={{ base: "center", md: "left" }} mt={{ base: 4, md: 2 }} ml={{ md: 2 }}>
                <Text fontWeight="bold" textTransform="uppercase" fontSize="lg" letterSpacing="wide" color="teal.600">
                  {data.name || ''}
                </Text>
                <Text my={2} color="gray.500">
                  {data.description || 'bbb'}
                </Text>
              </Stack>
            </LinkBox>
          );
        }) : null}
      </SimpleGrid>
    </Container>
  )
}
