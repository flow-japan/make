import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';
import { Title } from '../components/Title';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { ConnectButton } from '../components/ConnectButton';
import { View } from '../components/View';
import { Create } from '../components/Create';
import { flow } from '../services/flow';

const Index = () => {
  const [user, setUser] = useState({});

  useEffect(() => flow.setCurrentUser(setUser), []);

  return (
    <Container height="100vh">
      <Title />
      <Main>
        <Tabs isFitted variant="enclosed" m={4} size="sm">
          <TabList>
            <Tab>EXPLORE</Tab>
            <Tab>VIEW</Tab>
            <Tab>CREATE</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text as="kbd" ml={4} mt={8}>
                Under contruction.
              </Text>
            </TabPanel>
            <TabPanel>
              <View user={user} />
            </TabPanel>
            <TabPanel>
              <Create user={user} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <ConnectButton user={user} />
      </Main>

      <Spacer />
      <Text as="kbd" fontSize="small" pb={1} textColor="gray.500">
        Built on{' '}
        <ChakraLink
          isExternal
          href="https://www.onflow.org/"
          flexGrow={1}
          mr={2}
        >
          Flow Blockchain
        </ChakraLink>
        ⭐ Sponsored by{' '}
        <ChakraLink
          isExternal
          href="https://www.doublejump.tokyo/"
          flexGrow={1}
          mr={2}
        >
          double jump.tokyo
        </ChakraLink>
      </Text>
      <Text as="kbd" fontSize="small" pb={4} textColor="gray.500">
        <ChakraLink
          isExternal
          href="https://github.com/flow-japan/inscribe/"
          flexGrow={1}
          mr={2}
        >
          GitHub <LinkIcon />
        </ChakraLink>
      </Text>
    </Container>
  );
};

export default Index;
