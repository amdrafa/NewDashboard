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
  import { IoDiamondOutline } from "react-icons/io5";
  import { CgSandClock } from "react-icons/cg";
  import { Header } from "../../components/Header";
  import { Sidebar } from "../../components/Sidebar";
  import dynamic from "next/dynamic";
  import { SiOpenaigym } from "react-icons/si";
  import { Pagination } from "../../components/Pagination";
  import { BiShapeSquare } from "react-icons/bi";
  import { api } from "../../services/axios";
  import { useEffect, useState } from "react";
  import { useQuery } from "react-query";
  import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
  import { GiConfirmed } from "react-icons/gi";
  import dayjs from "dayjs";
  import { FiX } from "react-icons/fi";
  import { BsCheckLg, BsFillCircleFill } from "react-icons/bs";
  import { Footer } from "../../components/footer";
  import EditBooking from "../../components/editBooking";
  import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
  
export type DecodedToken = {
  id: string;
  sub?: string;
  iat: number;
  exp: number;
  roles: string;
  name: string;
  email: string;
  isForeigner: boolean;
};
  interface bookingProps {
    id: number;
    bookingId?: string;
    userId: number;
    dataInicial: Date;
    dataFinal: Date;
    status: string;
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
  
  export default function UserBookings() {

    const { auth } = parseCookies();

    const decodedUser = decode(auth as string) as DecodedToken;

    const [searchUsersValue, setSearchUsersValue] = useState("");

    const [filteredData, setFilteredData] = useState<bookingProps[]>([]);
  
    const router = useRouter()
  
    const toast = useToast()
  
    const [page, setPage] = useState(1);
  
    const [limit, setLimit] = useState(6);
  
    const [total, setTotal] = useState(10);
  
  
    const { data, isLoading, error } = useQuery<bookingProps[]>(
      `booking${page}`,
      async () => {
        const response = await api.get(
          `/booking/user/${decodedUser.id}`
        );
        const data = response.data;
        // set total count coming from response to paginate correctly
        setFilteredData(data)
        return data;
      },
      {
        enabled: !!decodedUser
      }
    );

    function handleSearchBookings(event: React.ChangeEvent<HTMLInputElement>){
      setSearchUsersValue(event.target.value);
  
      if (event.target.value.length == 1 || event.target.value.length == 0 ) {
        setSearchUsersValue("");
        setFilteredData(data)
        return;
      }
  
      setFilteredData(
        data?.filter((booking) => {
          return booking.id
            .toString()
            .includes(searchUsersValue.toLowerCase()) || dayjs(booking?.dataInicial).format('dddd, MMMM D, YYYY h:mm A')
            .toLowerCase()
            .includes(searchUsersValue.toLowerCase()) || dayjs(booking?.dataFinal).format('dddd, MMMM D, YYYY h:mm A')
            .toLowerCase()
            .includes(searchUsersValue.toLowerCase()) || booking.status
            .toLowerCase()
            .includes(searchUsersValue.toLowerCase())
        })
      );
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
                    Bookings
                  </Heading>
  
                  <Link href="/schedule">
                    <Button
                      size="sm"
                      fontSize="sm"
                      colorScheme="blue"
                      leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                    >
                      New booking
                    </Button>
                  </Link>
                </Flex>

                <Flex
                as="label"
                flex="1"
                py="2"
                px="8"
                maxWidth={230}
                alignSelf="center"
                color="gray.200"
                position="relative"
                bg="gray.900"
                borderRadius="full"
              >
                <Input
                  color="gray.50"
                  variant="unstyled"
                  px="4"
                  mr="4"
                  placeholder="Search for a user"
                  _placeholder={{ color: "gray.400" }}
                  onChange={handleSearchBookings}
                />
                <Icon as={RiSearchLine} fontSize="20" />
              </Flex>
  
                {isLoading ? (
                  <Flex justify="center">
                    <Spinner mt="10" mb="80px" />
                  </Flex>
                ) : error ? (
                  <Flex justify="center">
                    <Text>The requisition failed</Text>
                  </Flex>
                ) : data?.length > 0 ? (
                  <>
                    <Flex minHeight={'400px'} flexDir={'column'} justifyContent='space-between'>
                    <Flex
                height={"100%"}
                maxHeight={"24rem"}
                flexDir={"column"}
                mt={"1.2rem"}
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
                      <Table colorScheme="whiteAlpha">
                        <Thead>
                          <Tr>
                            <Th px={["4", "4", "6"]} color="gray.300" width="">
                              <Text>ID</Text>
                            </Th>
  
                            <Th px={["4", "4", "6"]} width="">
                              <Text>From</Text>
                            </Th>
  
                            <Th px={["4", "4", "6"]} width="">
                              <Text>To</Text>
                            </Th>
  
                            <Th px={["4", "4", "6"]} width="">
                              <Text>Status</Text>
                            </Th>
  
                            
                          </Tr>
                        </Thead>
                        <Tbody>
  
                          {data ? (
                            <>
                              {filteredData.map((booking) => (
                            <Tr
                              key={booking.id}
                              _hover={{
                                bg: "gray.900",
                                color: "gray.300",
                                transition: "0.2s",
                                cursor: "pointer",
                              }}
                              onClick={() => router.push(`/bookings/detail/${booking.id}`)}
                            >
                              <Td>
                                <Text fontWeight="bold">
                                  {booking?.id}
                                </Text>
                              </Td>
  
                              <Td>
                                <Text fontWeight="bold">
                                  {dayjs(booking?.dataInicial).format('dddd, MMMM D, YYYY h:mm A')}
                                </Text>
                              </Td>
  
                              <Td>
                              <Text fontWeight="bold">
                                  {dayjs(booking?.dataFinal).format('dddd, MMMM D, YYYY h:mm A')}
                                </Text>
                              </Td>
  
                              <Td>
                                <Text fontWeight="bold">
                                  {booking.status}
                                </Text>
                              </Td>
                            </Tr>
                          ))}
                            </>
                          ) : (
                            "menor"
                          )}
                        </Tbody>
                      </Table>
                      <Pagination
                        totalCountOfRegisters={total}
                        currentPage={page}
                        onPageChanges={setPage}
                      />
                    </Flex>
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
                        <Image opacity={0.4} src='images/noappointments.png' w={'200px'} />
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
  
          {/* <Modal
  
            isOpen={isModalOpen}
            onRequestClose={() => {
              setIsModalOpen(false);
              setIsConfirmMessageOpen(false);
            }}
            overlayClassName="react-modal-overlay"
            className="react-modal-delete-message"
            ariaHideApp={false}
          >
            
          </Modal> */}
  
          <Flex >
            <Flex w={{ lg: '275px' }}></Flex>
            <Footer />
          </Flex>
        </Box>
      </>
    );
  }
  