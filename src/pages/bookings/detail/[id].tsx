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

interface termProps {
  id: number;
  title: string;
  text: string;
}

interface vehicleTypeProps {
  id: number;
  passangerCar: number;
  urbanLightBus: number;
  coachBus: number;
  lightDutyTruck: number;
  urbanHeavyBus: number;
  others: number
}

interface inviteProps {
  id: number;
  guestName: string;
  guestEmail: string;
}

interface bookingProps {
  id: number;
  status: string;
  schedules: scheduleProps[];
  terms: termProps[];
  vehicleType: vehicleTypeProps;
  invite: inviteProps[];
}

export default function EditBooking() {
  const router = useRouter();
  const id = Number(router.query.id);

  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState("Schedules");

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

            <HStack spacing={"1rem"}>
              <Button
                w={"10rem"}
                background={
                  selectedTab === "Schedules" ? "blue.500" : "gray.900"
                }
                _hover={{ opacity: 0.7 }}
                onClick={() => setSelectedTab("Schedules")}
              >
                Schedules
              </Button>
              <Button
                w={"10rem"}
                background={
                  selectedTab === "InvitedPeople" ? "blue.500" : "gray.900"
                }
                _hover={{ opacity: 0.7 }}
                onClick={() => setSelectedTab("InvitedPeople")}
              >
                Atendees | Vehicles
              </Button>
            </HStack>
          </Flex>

          <Divider my="6" borderColor="gray.700" />

          {selectedTab == "Schedules" ? (
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
          ) : (
            <>
              <Flex
                w={"100%"}
                justifyContent={"center"}
                borderRadius="2xl"
                mb={"2.5rem"}
              pl={'4rem'}
              >
                <VStack>
                  <HStack>
                    <Text w={"20rem"}>Passanger car</Text>
                    <Input textAlign={'center'} w={"4rem"} name="passangerCar" defaultValue={data?.vehicleType?.passangerCar}/>
                    <Text w={"20rem"}>Light duty truck</Text>
                    <Input textAlign={'center'} w={"4rem"} name="lightDutyTruck" defaultValue={data?.vehicleType?.lightDutyTruck}/>
                  </HStack>
                  <HStack>
                    <Text w={"20rem"}>Urban light bus</Text>
                    <Input textAlign={'center'} w={"4rem"} name="urbanlightbus" defaultValue={data?.vehicleType?.urbanLightBus}/>
                    <Text w={"20rem"}>Urban heavy bus</Text>
                    <Input textAlign={'center'} w={"4rem"} name="urbanheavybus" defaultValue={data?.vehicleType?.urbanHeavyBus}/>
                  </HStack>
                  <HStack>
                    <Text w={"20rem"}>Coach bus</Text>
                    <Input textAlign={'center'} w={"4rem"} name="coachbus" defaultValue={data?.vehicleType?.coachBus}/>
                    <Text w={"20rem"}>Others</Text>
                    <Input textAlign={'center'} w={"4rem"} name="others" defaultValue={data?.vehicleType?.others}/>
                  </HStack>
                </VStack>
              </Flex>
              <Flex
                height={"100%"}
                maxHeight={"22rem"}
                flexDir={"column"}
                mt={"1.5rem"}
                w={"100%"}
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
                { selectedTab == "InvitedPeople" ? (
                  <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>

                      <Th px={["4", "4", "6"]} color="gray.300" width="">
                        <Text>Id</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} color="gray.300" width="">
                        <Text>Name</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Email</Text>
                      </Th>


                    </Tr>
                  </Thead>

                  <Tbody>
                    {data?.invite?.map(invited => {
                      return (
                        <Tr key={invited.id}>
                          <Td>{invited?.id}</Td>
                          <Td>{invited?.guestName}</Td>
                          <Td>{invited?.guestEmail}</Td>
                        </Tr>
                  
                      )
                    })}

                    {/* <Tr>
                      <Td>João Silva Pereira</Td>
                      <Td>joaopereira@gmail.com</Td>
                      <Td>07384617819</Td>
                      <Td w={"26rem"}>
                        <Flex
                          cursor={"pointer"}
                          color={"blue.500"}
                          justify={"center"}
                          alignItems="center"
                          w={"100%"}
                          _hover={{ color: "blue.700" }}
                        >
                          <GoPlus />
                          <Text ml={"0.5rem"}>Add e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr> */}
                    
                  </Tbody>
                </Table>
                ) : (
                  <Flex w={'100%'} justify='center'>
                    <Text color={'gray.500'}>
                      Add all people who are going to be part of the booking.
                    </Text>
                  </Flex>
                )}
              </Flex>
            </>
          )}

          
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
