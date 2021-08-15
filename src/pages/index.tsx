import React, { useState } from 'react';
import {
  Button,
  Box,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Title } from '../components/Title';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { ViewCollection } from '../components/ViewCollection';
import { ViewShowcase } from '../components/ViewShowcase';
import { Create } from '../components/Create';
import { Footer } from '../components/Footer';
import { flow } from '../services/flow';

const Index = () => {
  const [user, setUser] = useState({});

  const SignInOutButton = ({ user }) => {
    const signInOrOut = (event) => {
      event.preventDefault();
      if (user.loggedIn) {
        flow.unauthenticate();
      } else {
        flow.setCurrentUser(setUser);
        flow.authenticate();
      }
    };
    return user.loggedIn ? (
      <Stack>
        <Text color={'gray.700'} fontSize={'md'} as="ins">
          {user.addr}
        </Text>
        <Box position="fixed" top="2.5rem" right="1rem">
          <Button size="sm" onClick={signInOrOut}>
            Sign out
          </Button>
        </Box>
      </Stack>
    ) : (
      <Button size="sm" onClick={signInOrOut}>
        Connect
      </Button>
    );
  };

  return (
    <Container height="100vh">
      <Title />
      <Box position="fixed" top="1rem" right="1rem">
        <SignInOutButton user={user} />
      </Box>
      <Main>
        <Tabs isFitted variant="enclosed" m={4} size="sm">
          <TabList>
            <Tab>みんなのNFT</Tab>
            <Tab>自分のNFT</Tab>
            <Tab>発行</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ViewShowcase user={user} />
            </TabPanel>
            <TabPanel>
              <ViewCollection />
            </TabPanel>
            <TabPanel>
              <Create />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Main>
      <Spacer />
      <Footer />
    </Container>
  );
};

export default Index;
