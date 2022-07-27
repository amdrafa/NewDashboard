import {
  Flex,
  SimpleGrid,
  Box,
  Text,
  theme,
  Button,
  Checkbox,
  Heading,
  Icon,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  Divider,
  Spinner,
  Input,
  HStack,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import dynamic from "next/dynamic";
import { SiOpenaigym } from "react-icons/si";
import { Pagination } from "../components/Pagination";
import { BiShapeSquare } from "react-icons/bi";
import { api } from "../services/axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import dayjs from "dayjs";
import { FaExchangeAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ApprovalTimeCard } from "../components/approvalTimeCard";

interface appointmentsDataProps {
  data: appointmentProps;
  ref: string;
  ts: number;
}

interface appointmentProps {
  speedway: string;
  vehicle: string;
  selectedSlots: string[];
  companyName: string;
  userId: string;
}

interface busySlotsProps {
  busySlots: [];
}

export default function Dashboard() {
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [speedway, setSpeedway] = useState("");

  const [vehicle, setVehicle] = useState("");

  const [selectedSlots, setSelectedSlots] = useState(["20/02/2022"]);

  const [companyName, setCompanyName] = useState("");

  const [userId, setUserId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isApprovalsOpen, setIsApprovalsOpen] = useState(true);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(1);

  const {
    data: dataBusySlots,
    isLoading: isLoadingBusylots,
    error: errorBusylots,
  } = useQuery<busySlotsProps>(`busySlotsList`, async () => {
    const response = await api.get(`getbusyslots`);

    return response.data;
  });

  function handleAppointmentApproval({
    companyName,
    selectedSlots,
    speedway,
    userId,
    vehicle,
  }: appointmentProps) {
    setCompanyName(companyName);
    setSelectedSlots(selectedSlots);
    setSpeedway(speedway);
    setUserId(userId);
    setVehicle(vehicle);

    console.log(companyName, selectedSlots, speedway, userId, vehicle);

    setIsModalOpen(true);
    return;
  }

  const { data, isLoading, error } = useQuery<appointmentsDataProps[]>(
    `appointmentslist${page}`,
    async () => {
      const response = await api.get(
        `getalladmsappointments?page=${page}&limit=${limit}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotal(totalcount);

      return ReturnedData;
    }
  );

  return (
    <>
      <Box mt={-3}>
        <Header />

        <Flex w="100%" mt="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
          <Box w={"100%"} px={6} ml={6}>
            {isApprovalsOpen ? (
              <Box
                flex="1"
                borderRadius={8}
                bg="gray.800"
                p="8"
                mt={8}
                mb={20}
                maxWidth={1600}
              >
                <Flex mb="8" justify="space-between" align="center">
                  <Heading size="lg" fontWeight="normal">
                    Approvals
                  </Heading>

                  <Button
                    size="sm"
                    fontSize="sm"
                    colorScheme="blue"
                    leftIcon={<Icon as={FaExchangeAlt} fontSize="18" />}
                    onClick={() => {
                      setIsApprovalsOpen(false);
                    }}
                  >
                    Switch to all appointments
                  </Button>
                </Flex>

                {isLoading ? (
                  <Flex justify="center">
                    <Spinner mt="10" mb="80px" />
                  </Flex>
                ) : error ? (
                  <Flex justify="center">
                    <Text>The requisition failed</Text>
                  </Flex>
                ) : total > 0 ? (
                  <>
                    <Table colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th px={["4", "4", "6"]} color="gray.300">
                            <Text>Speedway</Text>
                          </Th>

                          <Th px={["4", "4", "6"]}>
                            <Text>Company</Text>
                          </Th>

                          <Th px={["4", "4", "6"]}>
                            <Text>Date</Text>
                          </Th>

                          <Th>Slots</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.map((appointment) => (
                          <Tr
                            key={appointment.ts}
                            _hover={{
                              bg: "gray.900",
                              color: "gray.300",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleAppointmentApproval({
                                companyName: appointment.data.companyName,
                                selectedSlots: appointment.data.selectedSlots,
                                speedway: appointment.data.speedway,
                                userId: appointment.data.userId,
                                vehicle: appointment.data.vehicle,
                              });
                            }}
                          >
                            <Td>
                              <Text fontWeight="bold">
                                {appointment.data.speedway}
                              </Text>
                            </Td>
                            <Td>
                              <Text>{appointment.data.companyName}</Text>
                            </Td>
                            <Td>
                              <Text>
                                {dayjs(
                                  appointment.data.selectedSlots[0]
                                ).format("DD/MM/YYYY")}
                              </Text>
                            </Td>
                            <Td>
                              <Flex wrap='wrap' alignSelf={'center'} alignItems={'center'} >
                                {appointment.data.selectedSlots.map((slot) => {
                                  return (
                                    <Text
                                      color={"gray.100"}
                                      fontWeight={"bold"}
                                      ml="2"
                                      p={2}
                                      rounded="lg"
                                      bg={"blue.600"}
                                      my='2'
                                    >
                                      {dayjs(slot).format("H")}:00 to{" "}
                                      {Number(dayjs(slot).format("H")) + 1}:00
                                    </Text>
                                  );
                                })}
                              </Flex>
                            </Td>

                            {/* <Td>
                            <HStack spacing={2}>
                              
                              <Button colorScheme={'green'}>
                                <Icon
                                as={GiConfirmed}
                                fontSize="20"
                              />
                              </Button>
                              <Button colorScheme={'red'}>
                                <Icon
                                as={GiConfirmed}
                                fontSize="20"
                              />
                              </Button>
                            </HStack>
                          </Td> */}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Pagination
                      totalCountOfRegisters={total}
                      currentPage={page}
                      onPageChanges={setPage}
                    />
                  </>
                ) : (
                  <Flex w="100%" justifyContent="center" h="200px">
                    <Box justifyContent="center" my={10}>
                      <Flex w="100%" justifyContent="center">
                        <Text fontSize={22} fontWeight="bold">
                          There are not new appointments.
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="center">
                        <Text color={"gray.200"} fontSize={18}>
                          All appointment requests are goint to appear here.
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                )}
              </Box>
            ) : (
              <Box
                flex="1"
                borderRadius={8}
                bg="gray.800"
                p="8"
                mt={8}
                mb={20}
                maxWidth={1600}
              >
                <Flex mb="8" justify="space-between" align="center">
                  <Heading size="lg" fontWeight="normal">
                    All appointments
                  </Heading>

                  <Button
                    size="sm"
                    fontSize="sm"
                    colorScheme="blue"
                    leftIcon={<Icon as={FaExchangeAlt} fontSize="18" />}
                    onClick={() => {
                      setIsApprovalsOpen(true);
                    }}
                  >
                    Switch to approvals
                  </Button>
                </Flex>

                {isLoading ? (
                  <Flex justify="center">
                    <Spinner mt="10" mb="80px" />
                  </Flex>
                ) : error ? (
                  <Flex justify="center">
                    <Text>The requisition failed</Text>
                  </Flex>
                ) : total > 0 ? (
                  <>
                    <Table colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th px={["4", "4", "6"]} color="gray.300">
                            <Text>Speedway</Text>
                          </Th>

                          <Th px={["4", "4", "6"]}>
                            <Text>Company</Text>
                          </Th>

                          <Th px={["4", "4", "6"]}>
                            <Text>Date</Text>
                          </Th>

                          <Th>Slots</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.map((appointment) => (
                          <Tr
                            key={appointment.ts}
                            _hover={{
                              bg: "gray.900",
                              color: "gray.300",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <Td>
                              <Text fontWeight="bold">
                                {appointment.data.speedway}
                              </Text>
                            </Td>
                            <Td>
                              <Text>{appointment.data.companyName}</Text>
                            </Td>
                            <Td>
                              <Text>
                                {dayjs(
                                  appointment.data.selectedSlots[0]
                                ).format("DD/MM/YYYY")}
                              </Text>
                            </Td>
                            <Td>
                              <HStack wordBreak={"-moz-initial"} >
                                {appointment.data.selectedSlots.map((slot) => {
                                  return (
                                    <Text
                                      color={"gray.100"}
                                      fontWeight={"bold"}
                                      ml="2"
                                      p={2}
                                      rounded="lg"
                                      bg={"blue.500"}
                                    >
                                      {dayjs(slot).format("H")}:00 to{" "}
                                      {Number(dayjs(slot).format("H")) + 1}:00
                                    </Text>
                                  );
                                })}
                              </HStack>
                            </Td>

                            {/* <Td>
                            <HStack spacing={2}>
                              
                              <Button colorScheme={'green'}>
                                <Icon
                                as={GiConfirmed}
                                fontSize="20"
                              />
                              </Button>
                              <Button colorScheme={'red'}>
                                <Icon
                                as={GiConfirmed}
                                fontSize="20"
                              />
                              </Button>
                            </HStack>
                          </Td> */}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Pagination
                      totalCountOfRegisters={total}
                      currentPage={page}
                      onPageChanges={setPage}
                    />
                  </>
                ) : (
                  <Flex w="100%" justifyContent="center" h="200px">
                    <Box justifyContent="center" my={10}>
                      <Flex w="100%" justifyContent="center">
                        <Text fontSize={22} fontWeight="bold">
                          There are not new appointments.
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="center">
                        <Text color={"gray.200"} fontSize={18}>
                          All appointment requests are goint to appear here.
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                )}
              </Box>
            )}
          </Box>
        </Flex>

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
              <Text fontSize={"2xl"}>Appointment approval</Text>
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
              <Text
                color={"gray.100"}
                display={"flex"}
                flexWrap='wrap'
                mb={6}
                fontSize={"lg"}
                alignItems="center"
              >
                <Text
                  mr={1}
                  color={"blue.500"}
                  fontWeight="bold"
                >{`${companyName}`}</Text>{" "}
                wants to schedule an appointment at{" "}
                <Text
                  color={"blue.500"}
                  fontWeight="bold"
                  ml={"1"}
                  fontSize={"md"}
                  mr="1"
                >
                  {speedway}
                </Text>{"on"}
                &nbsp;
                <Text
                  color={"blue.500"}
                  fontWeight="bold"
                  fontSize={"md"}
                >
                  {dayjs(selectedSlots[0]).format("DD/MM/YYYY")}{" "}
                </Text>{" "}
                !
              </Text>
              <Flex flexDir={"column"}>


                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 8).toString()} 
                timeLabel="20/02/2022"
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 8).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 8).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 9).toString()} 
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 9).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 9).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 10).toString()} 
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 10).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 10).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 11).toString()} 
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 11).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 11).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 12).toString()}  
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 12).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 12).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 13).toString()}  
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 13).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 13).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 14).toString()} 
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 14).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 14).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 15).toString()}  
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 15).toString())}
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 15).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 16).toString()} 
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 16).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 16).toString())}
                />

                <ApprovalTimeCard 
                slot={new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 17).toString()}  
                timeLabel="20/02/2022" 
                isCurrentUserAppointment={selectedSlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 17).toString())} 
                isBusy={isLoadingBusylots ? false : dataBusySlots.busySlots.some((slot) => slot === new Date(Number(dayjs(selectedSlots[0]).format('YYYY')), Number(dayjs(selectedSlots[0]).format('MM')) - 1, Number(dayjs(selectedSlots[0]).format('D')), 17).toString())}
                />
              </Flex>
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

                <Button type="submit" onClick={() => {}} colorScheme={"red"}>
                  Delete
                </Button>
              </HStack>
            </Flex>
          </SimpleGrid>
        </Modal>
      </Box>
    </>
  );
}
