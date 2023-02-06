import {
  Flex,
  SimpleGrid,
  Box,
  Text,
  Image,
  VStack,
  Icon,
  Select,
  Button,
  Divider,
  Checkbox,
  Heading,
  HStack,
  Link,
  useToast,
  Link as ChakraLink,
  Spinner,
  useBreakpointValue,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import {
  RiCalendarLine,
  RiCarLine,
  RiCloseCircleLine,
  RiMotorbikeLine,
} from "react-icons/ri";
import { GiAutoRepair, GiMineTruck } from "react-icons/gi";
import { FaCircle, FaTruckMonster } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import Modal from "react-modal";
import { LoginContext } from "../contexts/LoginContext";
import { api } from "../services/axios";
import Router from "next/router";
import { errors } from "faunadb";
import { ChooseVehicle } from "../components/ChooseVehicle";
import { useQuery } from "react-query";
import { CalendarHeader } from "../components/Calendar/CalendarHeader";
import { CalendarIndex } from "../components/Calendar";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import { Footer } from "../components/footer";
import { Input } from "../components/Form/input";
import { BiBuilding, BiTrash } from "react-icons/bi";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
}

interface speedwayProps {
  speedway: string;
  vehicles_limit: number;
  description: string;
}

interface dataProps {
  data: speedwayProps;
  ref: string;
  ts: number;
}


export default function Schedule() {

  const toast = useToast()

  const [isSameDay, setIsSameDay] = useState(true)

  const [isSlotLoading, setIsSlotLoading] = useState(true)

  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  function AddTimeSlot(slot: string) {

    let updatedSlots = [...selectedSlots]

    const slotIndex = updatedSlots.findIndex(registeredSlot => registeredSlot === slot)


    if (slotIndex >= 0) {
      updatedSlots.splice(slotIndex, 1)
      setSelectedSlots(updatedSlots)
    } else {
      if (dayjs(selectedSlots[0]).format('D') == dayjs(slot).format('D') || selectedSlots.length == 0) {
        setIsSameDay(true)
        updatedSlots.push(slot)
        setSelectedSlots(updatedSlots)
      } else {
        setIsSameDay(false)
      }

    }

  }

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [selectedResources, setSelectedResources] = useState([''])
  const [speedway, setSpeedway] = useState("");
  const [vehicle, setVehicle] = useState("Light vehicle");

  const [page, setPage] = useState(1)

  const [status, setStatus] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, user } = useContext(LoginContext);

  const [selectedTab, setSelectedTab] = useState('Resource')

  function updateTab(tab: string) {
    setSelectedTab(tab);
  }

  useEffect(() => {
    if (page == 2) {
      setTimeout(() => {
        setIsSlotLoading(false);
      }, 4000)
    }

  }, [page])

  useEffect(() => {
    if (status == 201) {
      setIsModalOpen(false)
      toast({
        title: "Appointment scheduled",
        description: `Appointment at ${dayjs(selectedSlots[0]).format('DD/MM/YYYY')} was scheduled successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      Router.push('/userdashboard')
    }
    setStatus(0);
  }, [status]);

  const { data, isLoading, error } = useQuery<dataProps[]>(
    `SpeedwayList`,
    async () => {
      const response = await api.get(`getspeedwaylist`);
      const { updatedSpeedways } = response.data;

      return updatedSpeedways;
    }
  );


  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function updateSelectedResource(resource: string) {
    setSelectedResources([...selectedResources, resource])
  }



  async function CreateSchedule(event: FormEvent) {
    event.preventDefault();
    console.log(user.companyName)

    await api
      .post("scheduletime", {
        selectedSlots,
        vehicle,
        speedway,
        userId: user.userId,
        userEmail: user.email,
        userName: user.name,
        companyName: user.companyName,
        companyRef: user.companyRef
      })
      .then((response) => setStatus(response.status))
      .catch((err) => {
        console.log(err);
        toast({
          title: "Your company don't have enough credits.",
          description: `Credits must be acquired if you want to schedule a test track.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });


    setVehicle("Light vehicle");
    setSpeedway("Select option");

  }


  return (
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
        >
          <Flex justifyContent={"space-between"} align="center">
            <Heading size="lg" fontWeight="normal">
              <HStack spacing={'1rem'}>
                <Button
                  w={'10rem'}
                  background={selectedTab === 'Resource' ? 'blue.500' : 'gray.800'}
                  _hover={selectedTab === 'Resource' ? { background: "blue.700" } : { background: "blackAlpha.500" }}
                  onClick={() => updateTab('Resource')}
                >
                  Resources
                </Button>
                <Button
                  w={'10rem'}
                  background={selectedTab === 'Extra' ? 'blue.500' : 'gray.800'}
                  _hover={selectedTab === 'Extra' ? { background: "blue.700" } : { background: "blackAlpha.500" }}
                  onClick={() => updateTab('Extra')}
                >
                  Atendees | Vehicles
                </Button>
              </HStack>

            </Heading>


            <Box mr={1}>
              <Icon fontSize={12} mr={2} color={"blue.500"} as={FaCircle} />
              <Icon fontSize={12} as={FaCircle} color={"gray.600"} />
            </Box>
          </Flex>

          <Divider my="6" borderColor="gray.700" />

          {selectedTab === 'Resource' ? (
            <Flex justifyContent={'space-between'}>
              <VStack spacing="4">
                <Text w="100%" fontSize="20" mb={3}>
                  Category
                </Text>

                <HStack spacing={'1rem'} mb={'1rem'} w={"22rem"}>
                  <ChooseVehicle onClick={() => setVehicle} isActive vehicleType="Test track" icon={RiCarLine} />
                  <ChooseVehicle onClick={() => setVehicle} vehicleType="Office" icon={BiBuilding} />
                  <ChooseVehicle onClick={() => setVehicle} vehicleType="Workshop" icon={GiAutoRepair} />
                </HStack>

                <Text w="100%" fontSize="20">
                  Resource
                </Text>

                <Flex w='100%'>
                  <Select
                    maxW={'22rem'}
                    onChange={(e) => setSpeedway(e.target.value)}
                    placeholder="Select option"
                    color="gray.300"
                    bg="gray.900"
                    border="none"
                    height="45px"
                  >
                    {isLoading ? (
                      <option value={"loading"}>loading</option>
                    ) : (
                      data.map((speed) => (
                        <option
                          key={speed.data.speedway}
                          value={speed.data.speedway}
                        >
                          {speed.data.speedway}
                        </option>
                      ))
                    )}
                  </Select>
                </Flex>


                <Text w="100%" fontSize="20">
                  Start date:
                </Text>

                <HStack spacing={'1rem'}>

                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'date'}
                    width='12rem'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'time'}
                    width='8rem'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                </HStack>

                <Text w="100%" fontSize="20">
                  End date:
                </Text>


                <HStack spacing={'1rem'}>
                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'date'}
                    width='12rem'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'time'}
                    width='8rem'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />
                </HStack>
              </VStack>

              <Flex height={'30rem'} minHeight={'400px'} flexDir={'column'} mt={'1.2rem'} ml={'4rem'} w={"100%"} overflowY={'scroll'} sx={
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
                        <Text>Company</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Responsable</Text>
                      </Th>

                      <Th>CNPJ</Th>

                      {isWideVersioon && <Th >Register date</Th>}
                      <Th w="8">Status</Th>

                      <Th w="8"></Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>

                    <Tr _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        teste
                      </Td>
                      <Td>
                        <BiTrash />
                      </Td>
                    </Tr>
                  </Tbody>

                </Table>
              </Flex>

              {/* <Flex background={'gray.900'} alignItems='center' justify={'start'} width={'22rem'} borderRadius='0.5rem'>

                <VStack w={'100%'}>
                  <Flex justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Passenger car</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="LighDutyTruck"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Light duty truck</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="LighDutyTruck"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex w='100%' justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Heavy duty truck</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="LighDutyTruck"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex w='100%' justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Urban light bus</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="LighDutyTruck"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex w='100%' justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Urban heavy bus</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="LighDutyTruck"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex w='100%' justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Coach bus</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="Coach bus"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                  <Flex w='100%' justifyContent={'center'} alignItems='center'>
                    <Text w={'8rem'} mr='1rem'>Others</Text>
                    <Flex w={'4rem'}>
                      <Input
                        name="Others"
                        bgColor={'gray.800'}
                        size='sm'
                      />
                    </Flex>
                  </Flex>
                </VStack>

              </Flex> */}
            </Flex>
          ) : (
            <VStack spacing="8">
              <Text w="100%" fontSize="20">
                Invite participants:
              </Text>

              <Flex w={'100%'}>
                <Input
                  name="Participant"
                  label="Participant name"
                />
              </Flex>

              <Text ml="1" w="100%" fontSize="18">
                Test track
              </Text>

              <HStack w={'100%'}>
                <Box>
                  <Input
                    name="FromDate"
                    type={'date'}
                    width='100%'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          cursor: 'not-allowed',
                          // filter: invert(100%)
                        }
                      }
                    }
                  />
                </Box>


                <Box>
                  <Input
                    name="FromDate"
                    type={'time'}
                    width='100%'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          color: "#fff"
                        }
                      }
                    }
                  />
                </Box>

              </HStack>

              <HStack w={'100%'}>
                <Box>
                  <Input
                    name="FromDate"
                    type={'date'}
                    width='100%'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          cursor: 'not-allowed',
                          // filter: invert(100%)
                        }
                      }
                    }
                  />
                </Box>


                <Box>
                  <Input
                    name="FromDate"
                    type={'time'}
                    width='100%'
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          cursor: 'not-allowed',
                          // filter: invert(100%)
                        }
                      }
                    }
                  />
                </Box>

              </HStack>

            </VStack>

          )}



          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/home">
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
              <Button colorScheme="blue" onClick={() => {

                {
                  speedway == '' ? (toast({
                    title: "Select a test track",
                    description: `You need to select a test track to proceed.`,
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                  })) : (
                    setPage(2)
                  )
                }


              }}>
                Next
              </Button>
            </HStack>
          </Flex>
        </Box>


      </Flex >


      <Flex >
        <Flex w={{ lg: '275px' }}></Flex>
        <Footer />
      </Flex>


    </Box >

  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { auth } = parseCookies(ctx)

  const decodedUser = decode(auth as string) as DecodedToken;


  const necessaryPermissions = ["SCHEDULE"]

  if (necessaryPermissions?.length > 0) {
    const hasAllPermissions = necessaryPermissions.some(permission => {
      return decodedUser?.permissions?.includes(permission)
    })


    if (!hasAllPermissions) {
      return {
        redirect: {
          destination: '/home',
          permanent: false
        }
      }
    }

  }

  // const necessaryRoles = ['USER']

  // if(necessaryRoles?.length > 0){
  //   const hasAllRoles = necessaryRoles.some(role => {
  //     return decodedUser.roles.includes(role)
  // });


  // if(!hasAllRoles){
  //   console.log(hasAllRoles)
  //   return {
  //     redirect: {
  //       destination: '/userdashboard',
  //       permanent: false
  //     }
  //   }
  // }
  // }

  return {
    props: {}
  }
}
