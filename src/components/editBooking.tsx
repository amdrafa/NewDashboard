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
  useToast,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Input } from "../components/Form/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";

type EditBookingFormData = {
  speedway: string;
  vehicle: string;
  companyName: string;
  status: string;
  companyRef: string;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditSpeedwayFormSchema = yup.object().shape({
  speedway: yup.string().required(),
  vehicles_limit: yup.number().required(),
  description: yup.string().required().min(10, "Minimum 10 letters."),
});

export default function EditBooking({
  companyName,
  companyRef,
  setIsEditMode,
  speedway,
  status,
  vehicle
}: EditBookingFormData) {
  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(EditSpeedwayFormSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);

  const toast = useToast();

  const { errors } = formState;

  // const handleEditSpeedway: SubmitHandler<EditBookingFormData> = async ({
  //   speedway,
  //   vehicles_limit,
  //   description,
  // }) => {
  //   await api
  //     .put("editspeedway", {
  //       data: speedway,
  //       vehicles_limit,
  //       description,
  //       speedwayId,
  //     })
  //     .then((response) => {
  //       toast({
  //         title: "Test track updated",
  //         description: `The test track was updated successfully.`,
  //         status: "success",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "top-right",
  //       });
  //     })
  //     .catch((err) => {
  //       toast({
  //         title: "Company name already exists",
  //         description: `This name is already in use. Please try another one.`,
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //         position: "top-right",
  //       });
  //     });
  // };

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
          position: "top-right",
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
          position: "top-right",
        });
      });
  }



  return (
    <Box
      as="form"
      flex="1"
      height={"100%"}
      borderRadius={8}
      bg="gray.800"
      p="8"
      mt={5}
    >
      <Flex justify={"space-between"} alignItems="center">
        <Heading justifyContent={"space-between"} size="lg" fontWeight="normal">
          Edit booking
        </Heading>

      </Flex>

      <Divider my="6" borderColor="gray.700" />

      <Flex height={'100%'} maxHeight={'26rem'} flexDir={'column'} mt={'1.2rem'} overflowY={'scroll'} sx={
        {
          "&::-webkit-scrollbar": {
            width: "10px",

          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "blackAlpha.500",
            borderRadius: "24px",
          },
        }
      }>
        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th px={["4", "4", "6"]} color="gray.300" width="">
                <Text>Id</Text>
              </Th>

              <Th px={["4", "4", "6"]} width="">
                <Text>Resource</Text>
              </Th>
              <Th px={["4", "4", "6"]} width="">
                <Text>From</Text>
              </Th>

              <Th>To</Th>

              <Th >Exclusive</Th>

              <Th >Status</Th>

              <Th w="8"></Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>

            <Tr>
              <Td>
                001
              </Td>
              <Td>
                VDA
              </Td>
              <Td>
                Feb 23, 2023 - 07:00 AM
              </Td>
              <Td >
                Feb 24, 2023 - 18:00 PM
              </Td>
              <Td>
                <Text ml={'1.5rem'} color={'blue.500'} fontWeight='bold'><IoDiamondOutline fontSize={'1.2rem'} /></Text>
              </Td>

              <Td >
                <HStack>
                  <Text color={'blue.500'} fontWeight='semibold'>
                    Approved
                  </Text>
                  <Icon as={BsCheckLg} color="blue.500" />
                </HStack>
              </Td>
              <Td>
                <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                  <BiTrash size={'1.2rem'} />
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </Box>
  );
}
