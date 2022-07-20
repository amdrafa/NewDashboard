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
import { toast, ToastContainer } from "react-toastify";
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
        toast.success("Speedway updated");
      })
      .catch((err) => {
        toast.error("Company name already registered");
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
        toast.success("Speedway disabled");
        setIsModalOpen(false);
        setIsEditMode(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Something went wrong");
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
        toast.success("Speedway active again");
        setIsEnableModalOpen(false);
        setIsEditMode(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Something went wrong");
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
          Edit speedway
        </Heading>
        {speedway_status == "active" ? (
          <Button bg='red.500' onClick={() => setIsModalOpen(true)} _hover={{bg:'red.400'}}>
            <Icon mr={1.5} as={FaLock} />
            Disable speedway
          </Button>
        ) : (
          <Button
            display={"flex"}
            alignItems={"center"}
            colorScheme="blue"
            onClick={() => setIsEnableModalOpen(true)}
          >
            <Icon mr={1.5} as={FaUnlockAlt} />
            Unblock speedway
          </Button>
        )}
      </Flex>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            name="speedway"
            label="Speedway name"
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
            <Text fontSize={"2xl"}>Disable speedway</Text>
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
              Do you really want to disable this speedway? All appointments
              schedueled are going to be canceled.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              An e-mail will be sent informing that the speedway is temporarily
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
            <Text fontSize={"2xl"}>Enable speedway</Text>
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
              Do you really want to enable this speedway? From this moment,
              everyone will be able to schedule an appointment at this speedway.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              Be sure the speedway is working properly before enabling the test
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
