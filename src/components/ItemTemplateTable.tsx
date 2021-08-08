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

export const ItemTemplateTable = (props) => {
  const [isSending, setIsSending] = useState(false);
  const [collectibleDataId, setCollectibleDataId] = useState(null);
  const [mintNum, setMintNum] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateMintNum = (value) => {
    setMintNum(value);
  };

  const clearModal = () => {
    onClose();
    setMintNum(1);
    setIsSending(false);
  };

  const sendMintTransaction = async () => {
    setIsSending(true);
    try {
      const result = await flow.mintNFT(collectibleDataId, mintNum);
      if (result) {
        console.log(result);
        clearModal();
        props.updateItemTemplates();
      }
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

  return (
    <>
      <Table colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Minted</Th>
            <Th>Limit</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.itemTemplates.map((itemTemplate, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Image
                    maxWidth="100px"
                    margin="auto"
                    src={itemTemplate.image}
                    alt={itemTemplate.name}
                  />
                </Td>
                <Td>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    letterSpacing="wide"
                    color="teal.600"
                  >
                    {itemTemplate.name}
                  </Text>
                  <Text my={2} color="gray.500">
                    {itemTemplate.description}
                  </Text>
                </Td>
                <Td isNumeric>{itemTemplate.mintedCount}</Td>
                <Td isNumeric>{itemTemplate.limit}</Td>
                <Td>
                  <Button size="sm" onClick={() => mint(itemTemplate.id)}>
                    Mint
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
