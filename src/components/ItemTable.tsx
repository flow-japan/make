import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
} from '@chakra-ui/react';
import { flow } from '../services/flow';

export const ItemTable = (props) => {
  const [isSending, setIsSending] = useState(false);
  const [collectibleDataId, setCollectibleDataId] = useState(null);
  const [mintNum, setMintNum] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateMintNum = (value) => {
    setMintNum(value);
  };

  const sendMintTransaction = async () => {
    setIsSending(true);
    try {
      const result = await flow.mintNFT(collectibleDataId, mintNum);
      console.log(result);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSending(false);
    }
  };

  const mint = (id) => {
    console.log('mint', id);
    setCollectibleDataId(id);
    onOpen();
  };

  return !props.items ? null : (
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
                  <Button size="sm" onClick={() => mint(item.id)}>
                    みんなにみせる
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Modal
        size="xl"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint NFT</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                value={mintNum}
                onChange={updateMintNum}
                max={100}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isSending}
              onClick={sendMintTransaction}
              isDisabled={!mintNum}
              spinner={<BeatLoader size={8} color="white" />}
              colorScheme="blue"
              mr={3}
            >
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
