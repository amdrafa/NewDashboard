import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import Modal from "react-modal";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaLock, FaUnlockAlt } from "react-icons/fa";

type EditSpeedwayFormData = {
  speedway: string;
  vehicles_limit: number;
  description: string;
  speedwayId: string;
  speedway_status: string;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditSpeedwayFormSchema = yup.object().shape({
  speedway: yup.string().required(),
  vehicles_limit: yup.number().required(),
  description: yup.string().required().min(10, "Minimum 10 letters."),
});

export default function EditSpeedway({
  speedway,
  description,
  vehicles_limit,
  setIsEditMode,
  speedwayId,
  speedway_status,
}: EditSpeedwayFormData) {
  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(EditSpeedwayFormSchema),
  });

  const toast = useToast()

  const { errors } = formState;

  const handleEditSpeedway: SubmitHandler<EditSpeedwayFormData> = async ({
    speedway,
    vehicles_limit,
    description,
  }) => {
    await api
      .put("editspeedway", {
        data: speedway,
        vehicles_limit,
        description,
        speedwayId,
      })
      .then((response) => {
        toast({
          title: "Test track updated",
          description: `The test track was updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      })
      .catch((err) => {
        toast({
          title: "Company name already exists",
          description: `This name is already in use. Please try another one.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });
  };

  async function disableSpeedway(id: string) {
    await api
      .post(
        `disablespeedway`,
        {},
        {
          params: {
            id,
          },
        }
      )
      .then((response) => {
        toast({
          title: "Test track disabled",
          description: `The test track was disabled successfully. Active it again if necessary.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
        setIsModalOpen(false);
        setIsEditMode(false);
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `An unknown error has occurred
          `,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });
  }

  async function enableSpeedway(id: string) {
    await api
      .post(
        `enablespeedway`,
        {},
        {
          params: {
            id,
          },
        }
      )
      .then((response) => {
        toast({
          title: "Test track enabled",
          description: `The test track was enabled successfully. Disable it again if necessary.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
        setIsEnableModalOpen(false);
        setIsEditMode(false);
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `An unknown error has occurred
          `,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);

  return (
    <Box
      as="form"
      flex="1"
      height={"100%"}
      borderRadius={8}
      bg="gray.800"
      p="8"
      mt={5}
      onSubmit={handleSubmit(handleEditSpeedway)}
    >
      <Flex justify={"space-between"} alignItems="center">
        <Heading justifyContent={"space-between"} size="lg" fontWeight="normal">
          Edit test track
        </Heading>
        {speedway_status == "active" ? (
          <Button bg='red.500' onClick={() => setIsModalOpen(true)} _hover={{bg:'red.400'}}>
            <Icon mr={1.5} as={FaLock} />
            Disable test track
          </Button>
        ) : (
          <Button
            display={"flex"}
            alignItems={"center"}
            colorScheme="blue"
            onClick={() => setIsEnableModalOpen(true)}
          >
            <Icon mr={1.5} as={FaUnlockAlt} />
            Unblock test track
          </Button>
        )}
      </Flex>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            name="speedway"
            label="Test track name"
            {...register("speedway")}
            error={errors.speedway}
            defaultValue={speedway}
          />
          <Input
            type="number"
            name="vehicles_limit"
            label="Vehicles limit"
            {...register("vehicles_limit")}
            error={errors.vehicles_limit}
            defaultValue={vehicles_limit}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            height="100"
            name="description"
            label="Description"
            {...register("description")}
            error={errors.description}
            defaultValue={description}
          />
        </SimpleGrid>
      </VStack>

      <HStack justify={"end"} spacing="4" mt={8}>
        <Button
          cursor={"pointer"}
          onClick={() => {
            setIsEditMode(false);
          }}
          as={"a"}
          colorScheme="whiteAlpha"
        >
          Cancel
        </Button>

        <Button
          isLoading={formState.isSubmitting}
          type="submit"
          colorScheme="blue"
        >
          Save
        </Button>
      </HStack>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-delete-message"
        ariaHideApp={false}
      >
        <SimpleGrid
          flex="1"
          gap="1"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            mb={2}
          >
            <Text fontSize={"2xl"}>Disable test track</Text>
            <Icon
              fontSize={20}
              as={IoMdClose}
              onClick={() => {
                setIsModalOpen(false);
              }}
              cursor={"pointer"}
            />
          </Box>
          <Divider orientation="horizontal" />

          <Box my={"4"}>
            <Text mb={2} fontSize={"md"}>
              Do you really want to disable this test track? All appointments
              schedueled are going to be canceled.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              An e-mail will be sent informing that the test track is temporarily
              disabled.
            </Text>
          </Box>

          <Flex justify={"flex-end"}>
            <HStack spacing={4}>
              <Button
                type="submit"
                onClick={() => setIsModalOpen(false)}
                colorScheme={"whiteAlpha"}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                onClick={() => {
                  disableSpeedway(speedwayId);
                }}
                colorScheme={"red"}
              >
                Disable
              </Button>
            </HStack>
          </Flex>
        </SimpleGrid>
      </Modal>

      <Modal
        isOpen={isEnableModalOpen}
        onRequestClose={() => setIsEnableModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-delete-message"
        ariaHideApp={false}
      >
        <SimpleGrid
          flex="1"
          gap="1"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            mb={2}
          >
            <Text fontSize={"2xl"}>Enable test track</Text>
            <Icon
              fontSize={20}
              as={IoMdClose}
              onClick={() => {
                setIsModalOpen(false);
              }}
              cursor={"pointer"}
            />
          </Box>
          <Divider orientation="horizontal" />

          <Box my={"4"}>
            <Text mb={2} fontSize={"md"}>
              Do you really want to enable this test track? From this moment,
              everyone will be able to schedule an appointment at this test track.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              Be sure the test track is working properly before enabling the test
              track.
            </Text>
          </Box>

          <Flex justify={"flex-end"}>
            <HStack spacing={4}>
              <Button
                type="submit"
                onClick={() => setIsEnableModalOpen(false)}
                colorScheme={"whiteAlpha"}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                onClick={() => {
                  enableSpeedway(speedwayId);
                }}
                colorScheme={"blue"}
              >
                Enable
              </Button>
            </HStack>
          </Flex>
        </SimpleGrid>
      </Modal>
    </Box>
  );
}
