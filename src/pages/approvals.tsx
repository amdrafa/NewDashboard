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
import { CgSandClock } from "react-icons/cg";
import { GiConfirmed } from "react-icons/gi";
import dayjs from "dayjs";
import { FaExchangeAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ApprovalTimeCard } from "../components/approvalTimeCard";
import { toast } from "react-toastify";
import { BsCheckLg, BsFillCircleFill } from "react-icons/bs";
import { FiX } from "react-icons/fi";

interface appointmentsDataProps {
  data: appointmentProps;
  ref: {
    "@ref": {
      id: number;
    };
  };
  ts: number;
}

interface appointmentProps {
  speedway: string;
  vehicle: string;
  selectedSlots: string[];
  companyName: string;
  status: string;
}

interface appointmentFunctionProps { 
  speedway: string;
  vehicle: string;
  selectedSlots: string[];
  companyName: string;
  appointmentId: number;
  status: string;
}

interface busySlotsProps {
  busySlots: [];
}

export default function Dashboard() {
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [isConfirmMessageOpen, setIsConfirmMessageOpen] = useState(false);

  const [speedway, setSpeedway] = useState("");

  const [appointmentStatus, setAppointmentStatus] = useState("");

  const [appointmentId, setAppointmentId] = useState(0);

  const [vehicle, setVehicle] = useState("");

  const [selectedSlots, setSelectedSlots] = useState(["20/02/2022"]);

  const [companyName, setCompanyName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenAllAppointments, setIsModalOpenAllAppointments] =
    useState(false);

  const [isApprovalsOpen, setIsApprovalsOpen] = useState(true);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(1);

  const [pageAllAppointments, setPageAllAppointments] = useState(1);

  const [limitAllAppointments, setLimitAllAppointments] = useState(6);

  const [totalAllAppointments, setTotalAllAppointments] = useState(1);

  const {
    data: dataBusySlots,
    isLoading: isLoadingBusylots,
    error: errorBusylots,
  } = useQuery<busySlotsProps>(`busySlotsList`, async () => {
    const response = await api.get(`getbusyslots`);

    return response.data;
  });


  async function handleCancelAppointment(id: number){
    await api
      .put("cancelappointment", {
        id,
      })
      .then((response) => {
        toast.success("Appointment canceled");
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }


  function handleAppointmentReject(id: number) {
    api
      .put("rejectappointment", {id})
      .then((response) => {
        toast.success("appointment rejected");
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });

    return;
  }

  function handleAppointmentApprovalFirstStep({
    companyName,
    selectedSlots,
    speedway,
    vehicle,
    appointmentId,
    status,
  }: appointmentFunctionProps) {
    setCompanyName(companyName);
    setSelectedSlots(selectedSlots);
    setSpeedway(speedway);
    setVehicle(vehicle);
    setAppointmentId(appointmentId);
    setAppointmentStatus(status);

    setIsModalOpen(true);
    return;
  }

  function handleAppointmentManegementFirstStep({
    companyName,
    selectedSlots,
    speedway,
    vehicle,
    appointmentId,
    status,
  }: appointmentFunctionProps) {
    setCompanyName(companyName);
    setSelectedSlots(selectedSlots);
    setSpeedway(speedway);
    setVehicle(vehicle);
    setAppointmentId(appointmentId);
    setAppointmentStatus(status);

    setIsModalOpenAllAppointments(true);
    return;
  }

  async function handleAppointmentApprovalSecondStep(id: number) {
    await api
      .put("acceptappointment", {
        id,
      })
      .then((response) => {
        toast.success("Appointment approved");
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }

  const { data, isLoading, error } = useQuery<appointmentsDataProps[]>(
    `appointmentslist${page}`,
    async () => {
      const response = await api.get(
        `getallpendingappointments?page=${page}&limit=${limit}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotal(totalcount);

      return ReturnedData;
    }
  );

  const {
    data: dataAllAppointments,
    isLoading: isLoadingAllAppointments,
    error: errorAllAppointments,
  } = useQuery<appointmentsDataProps[]>(
    `allappointmentslist${pageAllAppointments}`,
    async () => {
      const response = await api.get(
        `getalladmappointments?page=${pageAllAppointments}&limit=${limitAllAppointments}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotalAllAppointments(totalcount);

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

                          <Th>Status</Th>
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
                              handleAppointmentApprovalFirstStep({
                                companyName: appointment.data.companyName,
                                selectedSlots: appointment.data.selectedSlots,
                                speedway: appointment.data.speedway,
                                vehicle: appointment.data.vehicle,
                                appointmentId: appointment.ref["@ref"].id,
                                status: appointment.data.status,
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
                              <Flex
                                wrap="wrap"
                                alignSelf={"center"}
                                alignItems={"center"}
                              >
                                {appointment.data.selectedSlots.map((slot) => {
                                  return (
                                    <Text
                                      color={"gray.100"}
                                      fontWeight={"bold"}
                                      ml="2"
                                      p={2}
                                      rounded="lg"
                                      bg={"blue.600"}
                                    >
                                      {dayjs(slot).format("H")}:00 to{" "}
                                      {Number(dayjs(slot).format("H")) + 1}:00
                                    </Text>
                                  );
                                })}
                              </Flex>
                            </Td>

                            <Td>
                              <Flex alignItems={"center"}>
                                <Text
                                  mr={1}
                                  fontWeight={"bold"}
                                  color="blue.500"
                                >
                                  Pending
                                </Text>
                                <Icon
                                  as={CgSandClock}
                                  fontWeight="bold"
                                  fontSize={"22"}
                                  color="blue.500"
                                />
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

                {isLoadingAllAppointments ? (
                  <Flex justify="center">
                    <Spinner mt="10" mb="80px" />
                  </Flex>
                ) : errorAllAppointments ? (
                  <Flex justify="center">
                    <Text>The requisition failed</Text>
                  </Flex>
                ) : totalAllAppointments > 0 ? (
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

                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dataAllAppointments.map((appointment) => (
                          <Tr
                            onClick={() => {
                              handleAppointmentManegementFirstStep({
                                companyName: appointment.data.companyName,
                                selectedSlots: appointment.data.selectedSlots,
                                speedway: appointment.data.speedway,
                                vehicle: appointment.data.vehicle,
                                appointmentId: appointment.ref["@ref"].id,
                                status: appointment.data.status,
                              });
                            }}
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
                              <HStack wordBreak={"-moz-initial"}>
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

                            <Td>
                              {appointment.data.status == "approved" ? (
                                <Flex alignItems={"center"}>
                                  <Text
                                    mr={1}
                                    fontWeight={"bold"}
                                    color="blue.500"
                                  >
                                    Approved
                                  </Text>
                                  <Icon as={BsCheckLg} color="blue.500" />
                                </Flex>
                              ) : (
                                appointment.data.status == "rejected"? (
                                  <Flex alignItems={"center"}>
                                  <Text
                                    mr={1}
                                    fontWeight={"bold"}
                                    color="red.500"
                                  >
                                    Rejected
                                  </Text>
                                  <Icon
                                    as={FiX}
                                    fontWeight="bold"
                                    fontSize={"22"}
                                    color="red.500"
                                  />
                                </Flex>
                                ) : (
                                  <Flex alignItems={"center"}>
                                  <Text
                                    mr={1}
                                    fontWeight={"bold"}
                                    color="red.800"
                                  >
                                    Canceled
                                  </Text>
                                  <Icon
                                    as={FiX}
                                    fontWeight="bold"
                                    fontSize={"22"}
                                    color="red.800"
                                  />
                                </Flex>
                                )
                              )}
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
                      totalCountOfRegisters={totalAllAppointments}
                      currentPage={pageAllAppointments}
                      onPageChanges={setPageAllAppointments}
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
          onRequestClose={() => {
            setIsModalOpen(false)
            setIsConfirmMessageOpen(false)
          }}
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
              <Flex alignItems={"center"}>
                <Text fontSize={"2xl"} mr="4">
                  Appointments approval
                </Text>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  mt={"0.5"}
                >
                  <Flex alignItems={"center"}>
                    <Icon
                      fontSize={16}
                      color="blue.500"
                      mr={1}
                      as={BsFillCircleFill}
                      cursor={"pointer"}
                    />

                    <Text color={"blue.500"}>{companyName}</Text>
                  </Flex>

                  <Flex alignItems={"center"} ml="4">
                    <Icon
                      fontSize={16}
                      color="red.500"
                      mr={1}
                      as={BsFillCircleFill}
                      cursor={"pointer"}
                    />

                    <Text color={"red.500"}>Others</Text>
                  </Flex>
                </Flex>
              </Flex>

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
                flexWrap="wrap"
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
                </Text>
                {"on"}
                &nbsp;
                <Text color={"blue.500"} fontWeight="bold" fontSize={"md"}>
                  {dayjs(selectedSlots[0]).format("DD/MM/YYYY")}{" "}
                </Text>{" "}
                !
              </Text>
              <Flex flexDir={"column"}>
                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    8
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        8
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              8
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    9
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        9
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              9
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    10
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        10
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              10
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    11
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        11
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              11
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    12
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        12
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              12
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    13
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        13
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              13
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    14
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        14
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              14
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    15
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        15
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              15
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    16
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        16
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              16
                            ).toString()
                        )
                  }
                />

                <ApprovalTimeCard
                  slot={new Date(
                    Number(dayjs(selectedSlots[0]).format("YYYY")),
                    Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                    Number(dayjs(selectedSlots[0]).format("D")),
                    17
                  ).toString()}
                  timeLabel="20/02/2022"
                  isCurrentUserAppointment={selectedSlots.some(
                    (slot) =>
                      slot ===
                      new Date(
                        Number(dayjs(selectedSlots[0]).format("YYYY")),
                        Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                        Number(dayjs(selectedSlots[0]).format("D")),
                        17
                      ).toString()
                  )}
                  isBusy={
                    isLoadingBusylots
                      ? false
                      : dataBusySlots.busySlots.some(
                          (slot) =>
                            slot ===
                            new Date(
                              Number(dayjs(selectedSlots[0]).format("YYYY")),
                              Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                              Number(dayjs(selectedSlots[0]).format("D")),
                              17
                            ).toString()
                        )
                  }
                />
              </Flex>
            </Box>

            <Flex justify={"space-between"}>
              <Button
                type="submit"
                onClick={() => setIsModalOpen(false)}
                colorScheme={"whiteAlpha"}
                ml="2"
              >
                Cancel
              </Button>

              <HStack spacing={4}>
                <Button
                  type="submit"
                  onClick={() => handleAppointmentReject(appointmentId)}
                  colorScheme={"red"}
                >
                  Reject
                </Button>

                <Button
                  type="submit"
                  onClick={() => {
                    handleAppointmentApprovalSecondStep(appointmentId);
                  }}
                  colorScheme={"blue"}
                >
                  Accept
                </Button>
              </HStack>
            </Flex>
          </SimpleGrid>
        </Modal>

        <Modal
          isOpen={isModalOpenAllAppointments}
          onRequestClose={() => setIsModalOpenAllAppointments(false)}
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
              <Flex alignItems={"center"}>
                <Text fontSize={"2xl"} mr="4">
                  Manage appointment
                </Text>
                {!isConfirmMessageOpen && (
                  <Flex
                    alignItems={"center"}
                    justifyContent="space-between"
                    mt={"0.5"}
                  >
                    <Flex alignItems={"center"}>
                      <Icon
                        fontSize={16}
                        color="blue.500"
                        mr={1}
                        as={BsFillCircleFill}
                        cursor={"pointer"}
                      />

                      <Text color={"blue.500"}>{companyName}</Text>
                    </Flex>

                    <Flex alignItems={"center"} ml="4">
                      <Icon
                        fontSize={16}
                        color="red.500"
                        mr={1}
                        as={BsFillCircleFill}
                        cursor={"pointer"}
                      />

                      <Text color={"red.500"}>Others</Text>
                    </Flex>
                  </Flex>
                )}
              </Flex>

              <Icon
                fontSize={20}
                as={IoMdClose}
                onClick={() => {
                  setIsModalOpenAllAppointments(false);
                }}
                cursor={"pointer"}
              />
            </Box>
            <Divider orientation="horizontal" />

            <Box my={"4"}>
              <Text
                color={"gray.100"}
                display={"flex"}
                flexWrap="wrap"
                mb={6}
                fontSize={"lg"}
                alignItems="center"
              >
                <Text
                  mr={1}
                  color={"blue.500"}
                  fontWeight="bold"
                >{`${companyName}`}</Text>{" "}
                scheduled an appointment at{" "}
                <Text
                  color={"blue.500"}
                  fontWeight="bold"
                  ml={"1"}
                  fontSize={"md"}
                  mr="1"
                >
                  {speedway}
                </Text>
                {"on"}
                &nbsp;
                <Text color={"blue.500"} fontWeight="bold" fontSize={"md"}>
                  {dayjs(selectedSlots[0]).format("DD/MM/YYYY")}{" "}
                </Text>{" "}
                !
              </Text>

              {isConfirmMessageOpen ? (
                <Box mb={4}>
                  <Text display={"flex"}>
                    Do you really want to set this appointment status to{" "}
                    <Text color={"red.500"} fontWeight="bold">
                      &nbsp;Canceled
                    </Text>
                    ?
                  </Text>

                  <Text color={"gray.200"}>
                    An e-mail will be sent to the responsable for the company
                    informing that the appointment was canceled
                  </Text>
                </Box>
              ) : (
                <Flex flexDir={"column"}>
                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      8
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          8
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                8
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      9
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          9
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                9
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      10
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          10
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                10
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      11
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          11
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                11
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      12
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          12
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                12
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      13
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          13
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                13
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      14
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          14
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                14
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      15
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          15
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                15
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      16
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          16
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                16
                              ).toString()
                          )
                    }
                  />

                  <ApprovalTimeCard
                    slot={new Date(
                      Number(dayjs(selectedSlots[0]).format("YYYY")),
                      Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                      Number(dayjs(selectedSlots[0]).format("D")),
                      17
                    ).toString()}
                    timeLabel="20/02/2022"
                    isCurrentUserAppointment={selectedSlots.some(
                      (slot) =>
                        slot ===
                        new Date(
                          Number(dayjs(selectedSlots[0]).format("YYYY")),
                          Number(dayjs(selectedSlots[0]).format("MM")) - 1,
                          Number(dayjs(selectedSlots[0]).format("D")),
                          17
                        ).toString()
                    )}
                    isBusy={
                      isLoadingBusylots
                        ? false
                        : dataBusySlots.busySlots.some(
                            (slot) =>
                              slot ===
                              new Date(
                                Number(dayjs(selectedSlots[0]).format("YYYY")),
                                Number(dayjs(selectedSlots[0]).format("MM")) -
                                  1,
                                Number(dayjs(selectedSlots[0]).format("D")),
                                17
                              ).toString()
                          )
                    }
                  />
                </Flex>
              )}
            </Box>

            {appointmentStatus == "canceled" ||
            appointmentStatus == "rejected" ? (
              <Button
                    type="submit"
                    ml={4}
                    w={'20'}
                    onClick={() => {
                      setIsConfirmMessageOpen(false);
                      setIsModalOpenAllAppointments(false);
                    }}
                    colorScheme={"whiteAlpha"}
                  >
                    Return
                  </Button>
            ) : (
              <Flex justify={"end"}>
                <HStack spacing={4}>
                  <Button
                    type="submit"
                    onClick={() => {
                      setIsConfirmMessageOpen(false);
                      setIsModalOpenAllAppointments(false);
                    }}
                    colorScheme={"whiteAlpha"}
                  >
                    Return
                  </Button>

                  {isConfirmMessageOpen ? (
                    <Button
                      type="submit"
                      onClick={() => {
                        handleCancelAppointment(appointmentId)
                      }}
                      colorScheme={"red"}
                    >
                      Yes, I want to cancel
                    </Button>
                  ) : <Button
                  type="submit"
                  onClick={() => {
                    setIsConfirmMessageOpen(true);
                  }}
                  colorScheme={"red"}
                >
                  Cancel appointment
                </Button>}
                </HStack>
              </Flex>
            )}
          </SimpleGrid>
        </Modal>
      </Box>
    </>
  );
}
