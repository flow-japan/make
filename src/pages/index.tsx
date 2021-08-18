import React, { useState } from 'react';
import {
  Flex,
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
import Link from 'next/link';
import { Title } from '../components/Title';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { ViewCollection } from '../components/ViewCollection';
import { ViewShowcase } from '../components/ViewShowcase';
import { Create } from '../components/Create';
import { Footer } from '../components/Footer';
import { flow } from '../services/flow';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Index = () => {
  const { t } = useTranslation('common');
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
      <Flex justifyContent="space-between" width="100%">
        <Box mt="4" ml="6">
          <Link href="/" locale="ja">
            <Button size="sm" variant="link">
              🇯🇵 JA
            </Button>
          </Link>
          {' / '}
          <Link href="/" locale="en">
            <Button size="sm" variant="link">
              🇺🇸 EN
            </Button>
          </Link>
        </Box>
        <Spacer />
        <Title />
        <Spacer />
        <Box mt="4" mr="6">
          <SignInOutButton user={user} />
        </Box>
      </Flex>

      <Main>
        <Tabs isFitted variant="enclosed" m={4} size="sm">
          <TabList>
            <Tab>{t('showcase-nfts')}</Tab>
            <Tab>{t('my-nfts')}</Tab>
            <Tab>{t('publish')}</Tab>
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

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default Index;
