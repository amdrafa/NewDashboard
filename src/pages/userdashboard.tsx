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

interface appointmentsDataProps {
  data: appointmentProps;
  ref: string;
  ts: number;
}

interface appointmentProps {
  speedway: string;
  vehicle: string;
  selectedSlots: string[];
}

const Chart = dynamic(async () => await import("react-apexcharts"), {
  ssr: false,
});

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    forecolor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      new Date("2022-03-23T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-24T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-25T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-26T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-27T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-28T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      new Date("2022-03-29T00:00:00.000Z").toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    ],
  },

  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 18, 109] }];

export default function Dashboard() {
  console.log(getMonth());

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(-1);

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

  return (
    <>
      <Box >
        <Header />

        <Flex w="100%" mt="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />

          <Box w={"100%"} px={6} ml={6}>

            <Box
              flex="1"
              borderRadius={8}
              bg="gray.800"
              p="8"
              mt={4}
              mb={20}
              maxWidth={1600}
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
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="">
                          <Text>Speedway</Text>
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
                        <Tr key={appointment.ts}>
                          <Td>
                            <Box>
                            <Text fontWeight="bold">
                              {appointment.data.speedway}
                            </Text>
                            <Text color={'gray.300'}>
                              {appointment.data.vehicle}
                            </Text>
                            </Box>
                          </Td>

                          <Td>
                            <Text >
                              {dayjs(appointment.data.selectedSlots[0]).format('DD/MM/YYYY')}
                            </Text>
                          </Td>

                          <Td>
                          <HStack>
                              {appointment.data.selectedSlots.map((slot) => {
                                return (
                                  
                                    
                                    <Text
                                      color={"gray.100"}
                                      fontWeight={"bold"}
                                      ml='2'
                                      p={2}
                                      rounded='lg'
                                      bg={'blue.600'}
                                    >
                                      {dayjs(slot).format("H")}:00 to{" "}
                                      {Number(dayjs(slot).format("H")) + 1}:00
                                    </Text>
                                  
                                );
                              })}
                            </HStack>
                          </Td>

                          <Td>
                            <Flex>
                              <Text fontWeight={'bold'} color='blue.500'>Approved</Text>
                              <Icon
                                color={"blue.500"}
                                ml={1.5}
                                as={GiConfirmed}
                                fontSize="20"
                              />
                            </Flex>
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
                </>
              ) : total == -1 ? (
                <Flex justify="center">
                  <Spinner mt="10" mb="80px" />
                </Flex>
              ) : (
                <Flex w="100%" justifyContent="center">
                  <Box justifyContent="center" my={10}>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={22} fontWeight="bold">
                        You still don't have any appointment.
                      </Text>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={18}>
                        Go to the schedule page and book an appointment.
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
