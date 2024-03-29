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
  Checkbox,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Input } from "../../../../components/Form/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../../services/axios";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";
import { Header } from "../../../../components/Header";
import { Sidebar } from "../../../../components/Sidebar";
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
  userId: number;
  status: string;
  schedules: scheduleProps[];
}

export default function AdminEditBooking() {
  const router = useRouter();
  const id = Number(router.query.id);

  const toast = useToast();

  const [isConfirmationDeleteModalOpen, setIsConfirmationDeleteModalOpen] =
    useState(false);

  const [selectedSchedule, setSelectSchedule] = useState<scheduleProps>();

  const [selectedTab, setSelectedTab] = useState("Schedules");

  const [updatedDeletedSchedules, setUpdatedDeletedSchedules] = useState<
    scheduleProps[]
  >([]);

  const [updatedData, setUpdatedData] = useState<bookingProps>();

  const { data, isLoading, error } = useQuery<bookingProps>(
    `/booking/${id}/schedule`,
    async () => {
      const response = await api.get(`/booking/${id}/schedule`);
      const data = response.data;
      setUpdatedData(data);
      return data;
    },
    {
      enabled: !!id,
    }
  );

  function handleCloseConfirmationModal() {
    setIsConfirmationDeleteModalOpen(false);
  }

  async function handleDeleteSchedule() {
    await api
      .delete(`/schedule/delete/${selectedSchedule?.id}`)
      .then((response) => {
        toast({
          title: "Schedule deleted",
          description: `Schedule deleted successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        handleCloseConfirmationModal();

        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Error when deleting schedule.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }

  function handleUpdateSelectedDeletedSchedules(schedule: scheduleProps) {
    const scheduleIsDeleted = updatedDeletedSchedules.find(
      (item) => item.id == schedule.id
    );

    if (!scheduleIsDeleted) {
      setUpdatedDeletedSchedules([...updatedDeletedSchedules, schedule]);
      return;
    }

    setUpdatedDeletedSchedules(
      updatedDeletedSchedules.filter((item) => item.id !== schedule.id)
    );
    return;
  }

  async function handleUpdateBooking() {
    data.schedules.forEach((schedule) => {
      if (updatedDeletedSchedules.includes(schedule)) {
        schedule.status = "Rejected";
      } else {
        schedule.status = "Approved";
      }
    });

    console.log({
      booking: {
        id: data.id,
        status: "Approved",
        userId: data.userId,
        scheduleArray: data.schedules,
      },
    });

    await api.put('/booking/update/schedules', {
        booking: {
            id: data.id,
            status: "Approved",
        },
        scheduleArray: data.schedules
    })
    .then(response => {
      toast({
        title: "Booking approved",
        description: `Booking solicitation answered.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    })
    .catch(err => {
      toast({
        title: "Something went wrong",
        description: `Error when approving schedule.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
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
            <Box>
              <Heading
                justifyContent={"space-between"}
                size="lg"
                fontWeight="normal"
              >
                Booking approval
              </Heading>
              <Text color={"gray.400"}>
                Please select all schedules you want to remove
              </Text>
            </Box>

            
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
              {/* <Flex>
                    {updatedDeletedSchedules.map(item => {
                        return (
                            <Text>
                                {item.id}  {item.status} ||| 
                            </Text>
                        )
                    })}
                </Flex> */}

              {/* <Flex
              w={"100%"}
              justifyContent={"center"}
              borderRadius="2xl"
              mb={'4rem'}
            >
              <VStack color={'gray.400'}>
                <HStack >
                  <Text w={"20rem"}>Passanger car</Text>
                  <Input
                    w={"4rem"}
                    name="passangerCar"
                  />
                  <Text w={"20rem"}>Light duty truck</Text>
                  <Input
                    w={"4rem"}
                    name="lightDutyTruck"
                  />
                </HStack>
                <HStack>
                  <Text w={"20rem"}>Urban light bus</Text>
                  <Input
                    w={"4rem"}
                    name="urbanlightbus"
                  />
                  <Text w={"20rem"}>Urban heavy bus</Text>
                  <Input
                    w={"4rem"}
                    name="urbanheavybus"
                  />
                </HStack>
                <HStack>
                  <Text w={"20rem"}>Coach bus</Text>
                  <Input
                    w={"4rem"}
                    name="coachbus"
                  />
                  <Text w={"20rem"}>Others</Text>
                  <Input
                    w={"4rem"}
                    name="others"
                  />
                </HStack>
              </VStack>
            </Flex> */}
              <SimpleGrid
                minChildWidth="240px"
                spacing="8"
                w="100%"
                mb={"3rem"}
              >
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
              {data?.schedules?.length < 1 ? (
                <Flex w={"100%"} color="gray.400" justify={"center"} my="4rem">
                  <Text>You don't have schedules anymore in this booking.</Text>
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

                      {data?.status == "Pending" ? (
                        <Th>Delete</Th>
                      ) : (
                        ''
                      )}
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
                              color={
                                schedule.isExclusive ? "blue.500" : "gray.400"
                              }
                              fontWeight="bold"
                            >
                              <IoDiamondOutline fontSize={"1.2rem"} />
                            </Text>
                          </Td>

                          <Td>{schedule.status}</Td>
                          {data?.status == "Pending" ? (
                            <Td>
                            <Flex justify={"center"}>
                              <Checkbox
                                onChange={() =>
                                  handleUpdateSelectedDeletedSchedules(schedule)
                                }
                              />
                            </Flex>
                          </Td>
                          ) : (
                            <Tr>
                              
                            </Tr>
                          )}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </Flex>
         
          <Flex w={"100%"} mt="3rem" justify="flex-end">
            <HStack spacing="4">
              <Link href="/administrator/approval">
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
             {data?.status == "Pending" ? (
               <Button onClick={() => handleUpdateBooking()} colorScheme="blue">
               Confirm
             </Button>
             ) : (
              ''
             )}
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
            <Text as={"span"} color={"red.500"}>
              Delete
            </Text>{" "}
            schedule
          </Text>
        </Flex>
        <Text>Check all informations before continuous.</Text>
        <>
          <SimpleGrid
            minChildWidth="240px"
            spacing="8"
            w="100%"
            mb={"3rem"}
            mt="2rem"
          >
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
              defaultValue={dayjs(selectedSchedule?.startDate).format(
                "MMMM D, YYYY h:mm A"
              )}
              name="scheduleStartDate"
              label="From"
              isDisabled
            />

            <Input
              defaultValue={dayjs(selectedSchedule?.startDate).format(
                "MMMM D, YYYY h:mm A"
              )}
              name="scheduleFinalDate"
              label="To"
              isDisabled
            />
          </SimpleGrid>

          <HStack spacing={4} justify="end">
            <Button
              onClick={handleCloseConfirmationModal}
              colorScheme="whiteAlpha"
            >
              Cancel
            </Button>

            <Button colorScheme="red" onClick={() => handleDeleteSchedule()}>
              Delete
            </Button>
          </HStack>
         
        </>
      </Modal>
    </Box>
  );
}
