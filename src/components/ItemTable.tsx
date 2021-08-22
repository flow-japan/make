import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Alert,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Link,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { flow } from '../services/flow';

export const ItemTable = (props) => {
  const toast = useToast();
  const { t } = useTranslation('common');
  const [isSending, setIsSending] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteTokenId, setDeleteTokenId] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const deleteRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  const sendDepositNFTTransaction = async () => {
    setIsSending(true);
    try {
      const responce = await flow.depositNFT(tokenId);
      toast({
        title: t('tx-sent'),
        description: (
          <Link
            href={`https://flow-view-source.com/testnet/tx/${responce.transactionId}`}
            isExternal
          >
            {t('view-on-flow-view-source')}
          </Link>
        ),
        status: 'success',
        duration: null, // 9000
        isClosable: true,
      });
      const result = await flow.awaitSealed(responce);
      console.log(result);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSending(false);
    }
  };

  const sendDeleteNFTTransaction = async () => {
    try {
      const responce = await flow.deleteNFT(deleteTokenId);
      onDeleteClose();
      toast({
        title: t('tx-sent'),
        description: (
          <Link
            href={`https://flow-view-source.com/testnet/tx/${responce.transactionId}`}
            isExternal
          >
            {t('view-on-flow-view-source')}
          </Link>
        ),
        status: 'success',
        duration: null, // 9000
        isClosable: true,
      });
      const result = await flow.awaitSealed(responce);
      console.log(result);
    } catch (e) {
      console.log(e);
      onDeleteClose();
    }
  };

  const depositToShowcase = (id) => {
    setTokenId(id);
    onOpen();
  };

  const deleteNFT = (id) => {
    setDeleteTokenId(id);
    onDeleteOpen();
  };

  return !props.items ? (
    <></>
  ) : props.items.length === 0 ? (
    <Alert status="info" colorScheme="gray.50">
      {t('no-my-nft-message')}
    </Alert>
  ) : (
    <>
      <Table colorScheme="teal">
        <Thead>
          <Tr>
            <Th>{t('metadata-id')}</Th>
            <Th>{t('metadata-image')}</Th>
            <Th>{t('metadata-name')}</Th>
            <Th>{t('metadata-description')}</Th>
            <Th>{t('action')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.items.map((item, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Text my={2} color="gray.500">
                    {item.id}
                  </Text>
                </Td>
                <Td>
                  <Image
                    maxWidth="200px"
                    margin="auto"
                    src={item.image}
                    alt={item.name}
                    borderRadius="lg"
                    boxShadow="lg"
                  />
                </Td>
                <Td>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    letterSpacing="wide"
                    color="teal.600"
                  >
                    {item.name}
                  </Text>
                </Td>
                <Td>
                  <Text my={2} color="gray.500">
                    {item.description}
                  </Text>
                </Td>
                <Td>
                  <Button size="sm" onClick={() => depositToShowcase(item.id)}>
                    {t('display')}
                  </Button>
                  <Button
                    mt="4"
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteNFT(item.id)}
                  >
                    {t('delete')}
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={deleteRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('display')}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>{t('display-notification-message')}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                isLoading={isSending}
                onClick={sendDepositNFTTransaction}
                spinner={<BeatLoader size={8} color="white" />}
                colorScheme="blue"
                mr={3}
              >
                {t('button.ok')}
              </Button>
              <Button onClick={onClose}>{t('button.cancel')}</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={deleteRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('delete')}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>{t('delete-notification-message')}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button mr={3} onClick={onDeleteClose}>
                {t('button.cancel')}
              </Button>
              <Button
                onClick={sendDeleteNFTTransaction}
                spinner={<BeatLoader size={8} color="white" />}
                colorScheme="red"
              >
                {t('button.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
