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

interface appointmentsDataProps {
  data: appointmentProps;
  ref: string;
  ts: number;
}

interface appointmentProps {
  speedway: string;
  startDate: string;
  endDate: string;
  vehicle: string;
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
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(-1);

  const [companies, setCompanies] = useState<appointmentsDataProps[]>([]);

  const [needsLessHeight, setNeedsLessHeight] = useState('');

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
      <Box mt={-3}>
        <Header />

        <Flex w="100%" mt="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />

        <Box w={"100%"} px={6} ml={6}>

        
          <SimpleGrid
            flex="1"
            gap="4"
            minChildWidth="320px"
            alignItems="flex-start"
            mt="6"
          >
            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">
                Month appointments
              </Text>
              <Chart
                options={options}
                series={series}
                type="area"
                height={160}
              />
            </Box>

            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">
                Speedway usage
              </Text>
              <Chart
                options={options}
                series={series}
                type="area"
                height={160}
              />
            </Box>
          </SimpleGrid>




          <Box
            flex="1"
            borderRadius={8}
            bg="gray.800"
            p="8" 
            mt={20}
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
            ) : (
              total > 0? (<>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="">
                        <Text>Speedway</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>From</Text>
                      </Th>

                      <Th>To</Th>

                      {isWideVersioon && <Th>Vehicle</Th>}
                      <Th px={["4", "4", "6"]} width="">
                        <Text>Status</Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((appointment) => (
                      <Tr key={appointment.ts}>
                        <Td>
                          <Text fontWeight="bold">
                            {appointment.data.speedway}
                          </Text>
                        </Td>
                        <Td>
                          <Text>
                            {new Date(
                              appointment.data.startDate
                            ).toLocaleDateString()}
                          </Text>
                        </Td>
                        {isWideVersioon && (
                          <Td>
                            {new Date(
                              appointment.data.endDate
                            ).toLocaleDateString()}
                          </Td>
                        )}

                        {isWideVersioon && <Td>{appointment.data.vehicle}</Td>}

                        <Td>
                          <Flex>
                            <Icon
                              color={"blue.500"}
                              ml={4}
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
                  totalCountOfRegisters={total + 2}
                  currentPage={page}
                  onPageChanges={setPage}
                />
              </>) : (
                total == -1 ? (
                  <Flex justify="center">
                <Spinner mt="10" mb="80px" />
              </Flex>
                ) : (
                  (<Flex w="100%" justifyContent="center"> 
                <Box justifyContent="center" my={10}>
                    <Flex w="100%" justifyContent="center">
                        <Text fontSize={22} fontWeight="bold">You still don't have any appointment.</Text>         
                    </Flex>
                    <Flex w="100%" justifyContent="center">           
                <Text fontSize={18}>Go to the schedule page and book an appointment.</Text>
                </Flex> 
                </Box>
              </Flex>)
                )
              )
            )}
          </Box>

          </Box>
        </Flex>

        
        
      </Box>
    </>
  );
}
