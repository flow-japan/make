import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  Box,
  AspectRatio,
  Text,
  Image,
  IconButton,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Link,
  ModalFooter,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { Formik, Field, Form } from 'formik';
import { flow } from '../services/flow';
import axios from 'axios';

export const ItemCard = (props) => {
  const toast = useToast();
  const { t } = useTranslation('common');
  const [itemIdForReport, setItemIdForReport] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    itemId,
    tokenId,
    name,
    description,
    image,
    ownerAddress,
    likedAddresses,
  } = props.item;
  const id = tokenId;
  const likedAddressesArray =
    likedAddresses === '' ? [] : likedAddresses.split(',');
  const myAddress = props.myAddress;

  const showToast = (transactionId) => {
    toast({
      title: t('tx-sent'),
      description: (
        <Link
          href={`https://flow-view-source.com/testnet/tx/${transactionId}`}
          isExternal
        >
          {t('view-on-flow-view-source')}
        </Link>
      ),
      status: 'success',
      duration: null, // 9000
      isClosable: true,
    });
  };

  const sendLikeNFTTransaction = async (itemId) => {
    try {
      const responce = await flow.likeNFT(itemId);
      showToast(responce.transactionId);
      const result = await flow.awaitSealed(responce);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const sendWithdrawNFTTransaction = async (itemId) => {
    try {
      const responce = await flow.withdrawNFT(itemId);
      showToast(responce.transactionId);
      const result = await flow.awaitSealed(responce);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleReport = (itemId) => {
    setItemIdForReport(itemId);
    onOpen();
  };

  const reportMessage = async (values, actions) => {
    const message = values.message;
    await axios.post('/api/report', { message, itemId: itemIdForReport });
    actions.setSubmitting(false);
    alert(t('thank-you-for-reporting-message'));
    onClose();
  };

  return (
    <Box
      maxWidth="300px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <AspectRatio ratio={1}>
        <Box
          pos={'relative'}
          _after={{
            transition: 'all .2s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 3,
            left: 0,
            backgroundImage: `url(${image})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image objectFit={'cover'} src={image} boxShadow="lg" />
        </Box>
      </AspectRatio>

      <Box p="5" pr="4">
        <Box d="flex" alignItems="baseline" justifyContent="space-between">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            #{id}
          </Box>

          <Box alignItems="center" alignSelf="start">
            <IconButton
              icon={
                likedAddressesArray.includes(myAddress) ? (
                  <FaHeart />
                ) : (
                  <FiHeart />
                )
              }
              color={likedAddressesArray.includes(myAddress) ? 'red' : 'black'}
              aria-label="Like"
              variant="link"
              onClick={
                !likedAddressesArray.includes(myAddress)
                  ? () => sendLikeNFTTransaction(itemId)
                  : () => alert('Already Liked. Thank you.')
              }
            />
            <Box as="span" ml="1" color="gray.600" fontSize="sm">
              {likedAddressesArray.length}
            </Box>
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {name}
        </Box>

        <Box mt="1">
          <Text color={'gray.600'} noOfLines={4} fontSize="sm">
            {description}
          </Text>
        </Box>

        {ownerAddress === myAddress ? (
          <Box mt="2" ml="-2">
            <Button
              size="xs"
              colorScheme="blackAlpha"
              onClick={() => sendWithdrawNFTTransaction(itemId)}
            >
              {t('button.withdraw')}
            </Button>
          </Box>
        ) : null}

        <Box mt="1">
          <Button
            size="xs"
            fontWeight="lighter"
            variant="link"
            onClick={() => handleReport(itemId)}
          >
            {t('button.report')}
          </Button>
        </Box>
      </Box>

      <Modal
        size="xl"
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('report')}</ModalHeader>
          <ModalCloseButton />

          <Formik initialValues={{ message: '' }} onSubmit={reportMessage}>
            {(props) => (
              <Form>
                <ModalBody pb={6}>
                  <Field name="message">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.message && form.touched.message}
                      >
                        <FormLabel htmlFor="message">
                          {t('report-message')}
                        </FormLabel>
                        <Input
                          {...field}
                          id="message"
                          placeholder={t('message-input-placeholder')}
                        />
                        <FormErrorMessage>
                          {form.errors.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button
                    mr={3}
                    isLoading={props.isSubmitting}
                    spinner={<BeatLoader size={8} color="white" />}
                    colorScheme="blue"
                    type="submit"
                  >
                    {t('button.send')}
                  </Button>
                  <Button onClick={onClose}>{t('button.cancel')}</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </Box>
  );
};
