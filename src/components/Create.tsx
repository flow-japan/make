import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Link,
  Textarea,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Img } from 'react-image';
import { fleek } from '../services/fleek';
import { flow } from '../services/flow';

export const Create = () => {
  const toast = useToast();
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isProcessingImage, setProcessingImage] = useState(false);

  const updateItemName = (event) => {
    event.preventDefault();
    setItemName(event.target.value);
  };
  const updateItemDescription = (event) => {
    event.preventDefault();
    setItemDescription(event.target.value);
  };

  const processImage = async (event) => {
    try {
      setProcessingImage(true);
      const imageFile = event.target.files[0];
      if (!imageFile) return;
      const imageData = await (
        await fetch(URL.createObjectURL(imageFile))
      ).blob();
      const ipfsHash = await fleek.upload(imageData, imageFile.name);
      const imageUrl = fleek.getURL(ipfsHash);
      setItemImageUrl(imageUrl);
    } finally {
      setProcessingImage(false);
    }
  };

  const clearForm = () => {
    setItemName('');
    setItemDescription('');
    setItemImageUrl('');
  };

  const sendMintNFTTransaction = async () => {
    setIsSending(true);
    try {
      const responce = await flow.mintNFT(
        itemName,
        itemDescription,
        itemImageUrl
      );
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
      clearForm();
    } catch (e) {
      console.log(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Center>
        <Box width="600px" m={4}>
          <FormControl>
            <FormLabel>名前</FormLabel>
            <Input value={itemName} onChange={updateItemName} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>説明</FormLabel>
            <Textarea
              value={itemDescription}
              onChange={updateItemDescription}
            ></Textarea>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>画像</FormLabel>
            <input type="file" accept="image/*" onChange={processImage}></input>
            {itemImageUrl ? (
              <Box mt={2}>
                <Img src={itemImageUrl} alt={itemName} loader={<Spinner />} />
              </Box>
            ) : isProcessingImage ? (
              <Box mt={2}>
                <Spinner />
              </Box>
            ) : null}
          </FormControl>

          <Button
            mt={8}
            size="sm"
            isLoading={isSending}
            onClick={sendMintNFTTransaction}
            isDisabled={!itemName || !itemDescription || !itemImageUrl}
            spinner={<BeatLoader size={8} color="white" />}
            colorScheme="blue"
            mr={3}
          >
            発行
          </Button>
        </Box>
      </Center>
    </>
  );
};
