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
  Image,
  useToast
} from "@chakra-ui/react";
import { CgSandClock } from "react-icons/cg";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import dynamic from "next/dynamic";
import { SiOpenaigym } from "react-icons/si";
import { Pagination } from "../components/Pagination";
import { BiShapeSquare } from "react-icons/bi";
import { api } from "../services/axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import { getMonth } from "../util";
import dayjs from "dayjs";
import { FiX } from "react-icons/fi";
import { BsCheckLg, BsFillCircleFill } from "react-icons/bs";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { ApprovalTimeCard } from "../components/approvalTimeCard";
import noAppointments from '../../public/noappointments.png'
import { Footer } from "../components/footer";

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
  companyRef: string;
}

interface busySlotsProps {
  busySlots: [];
}

interface appointmentFunctionProps {
  speedway: string;
  vehicle: string;
  selectedSlots: string[];
  companyName: string;
  appointmentId: number;
  status: string;
  companyRef: string;
}

export default function UserDashboard() {
  console.log(getMonth());

  const toast = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmMessageOpen, setIsConfirmMessageOpen] = useState(false);

  const [speedway, setSpeedway] = useState("");

  const [appointmentStatus, setAppointmentStatus] = useState("");

  const [appointmentId, setAppointmentId] = useState(0);

  const [vehicle, setVehicle] = useState("");

  const [selectedSlots, setSelectedSlots] = useState(["20/02/2022"]);

  const [companyName, setCompanyName] = useState("");

  const [companyRef, setCompanyRef] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(-1);

  const {
    data: dataBusySlots,
    isLoading: isLoadingBusylots,
    error: errorBusylots,
  } = useQuery<busySlotsProps>(`busySlotsListUserDashboard${speedway}`, async () => {
    const response = await api.get(`getbusyslots?testtrack=${speedway}`);

    return response.data;
  });

  const { data, isLoading, error } = useQuery<appointmentsDataProps[]>(
    `userappointmentslist${page}`,
    async () => {
      const response = await api.get(
        `getalluserappointments?page=${page}&limit=${limit}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotal(totalcount);

      return ReturnedData;
    }
  );
  

  function handleAppointmentApprovalFirstStep({
    companyName,
    selectedSlots,
    speedway,
    vehicle,
    appointmentId,
    status,
    companyRef
  }: appointmentFunctionProps) {
    setCompanyName(companyName);
    setSelectedSlots(selectedSlots);
    setSpeedway(speedway);
    setVehicle(vehicle);
    setAppointmentId(appointmentId);
    setAppointmentStatus(status);
    setCompanyRef(companyRef)

    setIsModalOpen(true);
    return;
  }

  async function handleCancelAppointment(id: number) {
    await api
      .put("cancelappointment", {
        id,
        companyRef,
        selectedSlots: selectedSlots.length
      })
      .then((response) => {
        toast({
          title: "Appointment canceled",
          description: `Appointment at ${dayjs(selectedSlots[0]).format('DD/MM/YYYY')} was canceled.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Appointment at ${dayjs(selectedSlots[0]).format('DD/MM/YYYY')} couldn't be canceled.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });
  }

  return (
    <>
      <Box mt={-3}>
        <Header />

        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />

          <Box
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p="8"
            mt={5}
            height="100%"
          >
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                My appointments
              </Heading>

              <Link href="/schedule">
                <Button
                  size="sm"
                  fontSize="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Schedule an appointment
                </Button>
              </Link>
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
              <Flex minHeight={'400px'} flexDir={'column'} justifyContent='space-between'>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="">
                        <Text>Test track</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Date</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Slots</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Status</Text>
                      </Th>
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
                            appointmentId: appointment.ref["@ref"].id,
                            companyName: appointment.data.companyName,
                            selectedSlots: appointment.data.selectedSlots,
                            speedway: appointment.data.speedway,
                            status: appointment.data.status,
                            vehicle: appointment.data.vehicle,
                            companyRef: appointment.data.companyRef
                          });
                        }}
                      >
                        <Td>
                          <Box>
                            <Text fontWeight="bold">
                              {appointment.data.speedway}
                            </Text>
                            <Text color={"gray.300"}>
                              {appointment.data.vehicle}
                            </Text>
                          </Box>
                        </Td>

                        <Td>
                          <Text>
                            {dayjs(appointment.data.selectedSlots[0]).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </Td>

                        <Td>
                          <Flex
                                wrap="wrap"
                                alignSelf={"center"}
                                alignItems={"center"}>
                            {appointment.data.selectedSlots.map((slot) => {
                              return (
                                <Text
                                  key={slot}
                                  color={"gray.100"}
                                  fontWeight={"bold"}
                                  ml="2"
                                  my="1"
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
                          {appointment.data.status == "approved" && (
                            <Flex alignItems={"center"}>
                              <Text
                                mr={1}
                                fontWeight={"bold"}
                                color="whatsapp.400"
                              >
                                Approved
                              </Text>
                              <Icon as={BsCheckLg} color="green.500" />
                            </Flex>
                          )}

                          {appointment.data.status == "rejected" && (
                            <Flex alignItems={"center"}>
                              <Text mr={1} fontWeight={"bold"} color="red.500">
                                Rejected
                              </Text>
                              <Icon
                                as={FiX}
                                fontWeight="bold"
                                fontSize={"22"}
                                color="red.500"
                              />
                            </Flex>
                          )}

                          {appointment.data.status == "pending" && (
                            <Flex alignItems={"center"}>
                              <Text mr={1} fontWeight={"bold"} color="blue.500">
                                Pending
                              </Text>
                              <Icon
                                as={CgSandClock}
                                fontWeight="bold"
                                fontSize={"22"}
                                color="blue.500"
                              />
                            </Flex>
                          )}

                          {appointment.data.status == "canceled" && (
                            <Flex alignItems={"center"}>
                              <Text mr={1} fontWeight={"bold"} color="red.700">
                                Canceled
                              </Text>
                              <Icon
                                as={FiX}
                                fontWeight="bold"
                                fontSize={"22"}
                                color="red.700"
                              />
                            </Flex>
                          )}
                          {/* {appointment.data.status == "approved" ? (
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
                              )} */}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Pagination
                  totalCountOfRegisters={total}
                  currentPage={page}
                  onPageChanges={setPage}
                />
                </Flex>
              </>
            ) : total == -1 ? (
              <Flex justify="center">
                <Spinner mt="10" mb="80px" />
              </Flex>
            ) : (
              <Flex w="100%" alignItems={'center'} justifyContent="center" minH={'400px'} cursor={'not-allowed'} > 
                <Box justifyContent="center" mb={8} display='flex' flexDirection={'column'}>
                  <Flex justifyContent={'center'}>
                    <Image opacity={0.4} src='images/noappointments.png' w={'200px'}/>
                  </Flex>
                  <Flex w="100%" justifyContent="center">
                    <Text fontSize={24} fontWeight="bold" color={'blackAlpha.400'}>
                      You still don't have any appointment.
                    </Text>
                  </Flex>
                  <Flex w="100%" justifyContent="center">
                    <Text fontSize={18} color={'blackAlpha.400'} fontWeight='semibold'>
                      Go to the schedule page and book an appointment.
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            )}
          </Box>
        </Flex>

        <Modal
          
          isOpen={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
            setIsConfirmMessageOpen(false);
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

                    <Text color={"blue.500"}>Selected</Text>
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
                  setIsConfirmMessageOpen(false)
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
                  Once you cancel an appointment, it never can be undone or edited. In case of mistake you cancel and schedule again.
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
              )}
            </Box>

            {appointmentStatus == "pending" ? (
              <Flex justify={"space-between"}>
                <Button
                  type="submit"
                  onClick={() => setIsModalOpen(false)}
                  colorScheme={"whiteAlpha"}
                  ml="2"
                >
                  Back
                </Button>

                {isConfirmMessageOpen ? (<Button type="submit" onClick={() => {
                  handleCancelAppointment(appointmentId)}
                  } colorScheme={"red"}>
                  Yes, I want to cancel
                </Button>) : (
                  <Button type="submit" onClick={() => {setIsConfirmMessageOpen(true)}} colorScheme={"red"}>
                  Cancel appointment
                </Button>
                )}
              </Flex>
            ) : (
              <Flex>
                <Button
                  type="submit"
                  onClick={() => setIsModalOpen(false)}
                  colorScheme={"whiteAlpha"}
                  ml="2"
                >
                  Back
                </Button>
              </Flex>
            )}
          </SimpleGrid>
        </Modal>

        <Flex >
        <Flex  w={{lg: '275px'}}></Flex>
      <Footer />
      </Flex>
      </Box>
    </>
  );
}
