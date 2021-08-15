import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Container,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { flow } from '../services/flow';

export const ItemTable = (props) => {
  const toast = useToast();
  const [isSending, setIsSending] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const sendDepositNFTTransaction = async () => {
    setIsSending(true);
    try {
      const responce = await flow.depositNFT(tokenId);
      toast({
        title: 'トランザクションが送信されました',
        description: (
          <Link
            href={`https://flow-view-source.com/testnet/tx/${responce.transactionId}`}
            isExternal
          >
            Flow View Source で見る
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

  const depositToShowcase = (id) => {
    setTokenId(id);
    onOpen();
  };

  return !props.items ? (
    <></>
  ) : props.items.length === 0 ? (
    <Alert status="info" colorScheme="gray.50">
      持っている NFT はありません。「発行」タブから NFT を発行してみましょう！
    </Alert>
  ) : (
    <>
      <Table colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>画像</Th>
            <Th>名前</Th>
            <Th>説明</Th>
            <Th>アクション</Th>
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
                    展示する
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Modal
        size="xl"
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>展示する</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Text>
              展示すると「自分のNFT」から消えて「みんなのNFT」に表示されます。
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isSending}
              onClick={sendDepositNFTTransaction}
              spinner={<BeatLoader size={8} color="white" />}
              colorScheme="blue"
              mr={3}
            >
              OK
            </Button>
            <Button onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
