import { useState, useEffect } from 'react';
import {
  Button,
  Box,
} from '@chakra-ui/react';
import { flow } from '../services/flow';

const SignInOutButton = ({ user }) => {
  const signInOrOut = event => {
    event.preventDefault();

    if (user.loggedIn) {
      flow.unauthenticate();
    } else {
      flow.authenticate();
    }
  };

  return (
    <Button size="sm" onClick={signInOrOut}>
      {user.loggedIn ? 'Sign out' : 'Connect'}
    </Button>
  );
};

export const ConnectButton = props => {
  return (
    <Box
      position="fixed"
      top="1rem"
      right="1rem"
      color="green"
    >
      <SignInOutButton user={props.user} />
    </Box>
  )
}
