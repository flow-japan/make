import { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Textarea,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { fleek } from '../services/fleek';
import { flow } from '../services/flow';

export const CreateItemTemplateModal = props => {
  const [ itemName, setItemName ] = useState('');
  const [ itemDescription, setItemDescription ] = useState('');
  const [ itemImageUrl, setItemImageUrl ] = useState('');
  const [ itemLimit, setItemLimit ] = useState(1);
  const [ isSending, setIsSending ] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateItemName = event => { event.preventDefault(); setItemName(event.target.value); };
  const updateItemDescription = event => { event.preventDefault(); setItemDescription(event.target.value); };
  const updateItemLimit = value => { setItemLimit(value); };

  const processImage = async event => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    const imageData = await (await fetch(URL.createObjectURL(imageFile))).blob();
    const ipfsHash = await fleek.upload(imageData, imageFile.name);
    const imageUrl = fleek.getURL(ipfsHash);
    setItemImageUrl(imageUrl);
  }
  
  const clearModal = () => {
    onClose();
    setItemName('');
    setItemDescription('');
    setItemImageUrl('');
    setItemLimit(1);
    setIsSending(false);
  }

  const sendCreateItemTemplateTransaction = async () => {
    setIsSending(true);
    try {
      const result = await flow.createCollectibleData(itemName, itemDescription, itemImageUrl, itemLimit);
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
  }

  return (
    <>
      <Button m={2} size="sm" onClick={onOpen}>Create Item</Button>

      <Modal size="xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Item</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={itemName} onChange={updateItemName} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={itemDescription} onChange={updateItemDescription}></Textarea>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <input type="file" accept="image/*" onChange={processImage}></input>
              {itemImageUrl ? <Box mt={2}>
                <Image
                  src={itemImageUrl}
                  alt={itemName}
                />
              </Box> : null}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Limit</FormLabel>
              <NumberInput value={itemLimit} onChange={updateItemLimit} max={1000000} min={1}>
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
              onClick={sendCreateItemTemplateTransaction}
              isDisabled={!itemName || !itemDescription || !itemImageUrl || !itemLimit}
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
  )
}
