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
  Link,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Input } from "../../../components/Form/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../services/axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

interface scheduleProps {
  id: number;
  startDate: Date;
  finalDate: Date;
  isExclusive: boolean;
  status: string;
}

interface bookingProps {
  id: number;
  status: string;
  schedules: scheduleProps[];
}

export default function EditBooking() {
  const router = useRouter();
  const id = Number(router.query.id);

  const toast = useToast();

  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] = useState(false)

  const [selectedSchedule, setSelectSchedule] = useState<scheduleProps>()


  const { data, isLoading, error } = useQuery<bookingProps>(
    `/booking/${id}/schedule`,
    async () => {
      const response = await api.get(`/booking/${id}/schedule`);
      const data = response.data;

      return data;
    },
    {
      enabled: !!id,
    }
  );

  function handleCloseConfirmationModal(){
    setIsConfirmationDeleteModalOpen(false)
  }

  async function handleDeleteSchedule(){
    await api.delete(`/schedule/delete/${selectedSchedule?.id}`)
    .then(response => {
      toast({
        title: "Schedule deleted",
        description: `Schedule deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });

      handleCloseConfirmationModal()

      window.location.reload()

    })
    .catch(err => {
      toast({
        title: "Something went wrong",
        description: `Error when deleting schedule.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    })
  }

  return (
    <Box mt={-3}>
      <Header />
      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />
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
            <Heading
              justifyContent={"space-between"}
              size="lg"
              fontWeight="normal"
            >
              Edit booking
            </Heading>
          </Flex>

          <Divider my="6" borderColor="gray.700" />

          <Flex
            height={"100%"}
            maxHeight={"26rem"}
            flexDir={"column"}
            mt={"1.2rem"}
            overflowY={"scroll"}
            sx={{
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
            }}
          >
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={"3rem"}>
              <Input
                defaultValue={data?.id}
                name="bookingid"
                label="Booking id"
                isDisabled
              />

              <Input
                defaultValue={data?.status}
                name="status"
                label="Status"
                isDisabled
              />
            </SimpleGrid>
            {data?.schedules.length < 1 ? (
              <Flex w={'100%'} color='gray.400' justify={'center'} my='4rem'>
                <Text>
                  You don't have schedules anymore in this booking.
                </Text>
              </Flex>
            ) : (
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

                  <Th>Exclusive</Th>

                  <Th>Status</Th>

                  <Th></Th>
                </Tr>
              </Thead>

              <Tbody>
                {data?.schedules?.map((schedule) => {
                  return (
                    <Tr key={schedule.id}>
                      <Td>{schedule.id}</Td>
                      <Td>VDA - Fix</Td>
                      <Td>
                        {dayjs(schedule.startDate).format(
                          "dddd, MMMM D, YYYY h:mm A"
                        )}
                      </Td>
                      <Td>
                        {dayjs(schedule.finalDate).format(
                          "dddd, MMMM D, YYYY h:mm A"
                        )}
                      </Td>

                      <Td>
                        <Text
                          ml={"1.5rem"}
                          color={schedule.isExclusive ? "blue.500" : "gray.400"}
                          fontWeight="bold"
                        >
                          <IoDiamondOutline fontSize={"1.2rem"} />
                        </Text>
                      </Td>

                      <Td>{schedule.status}</Td>
                      <Td>
                        <Flex
                          color={"gray.500"}
                          fontWeight="semibold"
                          _hover={{ color: "red.500", cursor: "pointer" }}
                          onClick={() => {
                            setIsConfirmationDeleteModalOpen(true)
                            setSelectSchedule(schedule)
                          }}
                        >
                          <BiTrash size={"1.2rem"} />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            )}
          </Flex>
          <Flex w={"100%"} mt="3rem" justify="flex-end">
              <HStack spacing="4">
                <Link href="/bookings">
                  <Button colorScheme="whiteAlpha">Cancel</Button>
                </Link>
              </HStack>
            </Flex>
        </Box>
      </Flex>

      <Modal
        isOpen={isConfirmationDeleteModalOpen}
        onRequestClose={handleCloseConfirmationModal}
        overlayClassName="react-modal-overlay"
        className="react-modal-content-slots-confirmation"
        ariaHideApp={false}
      >
        <Flex justifyContent="flex-start">
          <Text fontSize={24} fontWeight="bold" color={"gray.100"}>
            <Text as={'span'} color={'red.500'}>Delete</Text> schedule
          </Text>
        </Flex>
        <Text>Check all informations before continuous.</Text>
          <>
          <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={"3rem"} mt='2rem'>
              <Input
                defaultValue={selectedSchedule?.id}
                name="scheduleid"
                label="Id"
                isDisabled
              />

              <Input
                defaultValue={selectedSchedule?.status}
                name="selectedScheduleStatus"
                label="Status"
                isDisabled
              />
            </SimpleGrid>
            
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={"3rem"}>
              <Input
                defaultValue={dayjs(selectedSchedule?.startDate).format('MMMM D, YYYY h:mm A')}
                name="scheduleStartDate"
                label="From"
                isDisabled
              />

              <Input
                defaultValue={dayjs(selectedSchedule?.startDate).format('MMMM D, YYYY h:mm A')}
                name="scheduleFinalDate"
                label="To"
                isDisabled
              />
            </SimpleGrid>

            <HStack spacing={4} justify="end">
              <Button onClick={handleCloseConfirmationModal} colorScheme="whiteAlpha">
                Cancel
              </Button>

              <Button
                colorScheme="red"
                onClick={() => handleDeleteSchedule()}
              >
                Delete
              </Button>
            </HStack>
          </>
      </Modal>
    </Box>
  );
}
