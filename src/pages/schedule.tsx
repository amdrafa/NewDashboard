import {
  Flex,
  SimpleGrid,
  Box,
  Text,
  VStack,
  Icon,
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  useToast,
  useBreakpointValue,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Checkbox,
  Grid,
  Select,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FormEvent, useContext, useEffect, useState } from "react";
import {
  RiCarLine,
} from "react-icons/ri";
import { FiTool } from "react-icons/fi";
import { IoDiamondOutline } from "react-icons/io5";
import Modal from "react-modal";
import { LoginContext } from "../contexts/LoginContext";
import { api } from "../services/axios";
import Router from "next/router";
import { ChooseVehicle } from "../components/ChooseVehicle";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import { Footer } from "../components/footer";
import { Input } from "../components/Form/input";
import { BiBuilding, BiTrash } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { BsCartX } from "react-icons/bs";
import { MultiSelect } from "react-multi-select-component";
import { v4 } from "uuid";
import { MdDownloadDone, MdOutlineDone } from "react-icons/md";

interface scheduleResponse {
  startDate: string;
  finalDate: string;
  id: number;
  isExclusive: boolean;
  status: string;
  resources
}

interface bookingAndScheduleResponse {
    dataInicial: Date;
    dataFinal: Date;
    id: number;
    schedules: scheduleResponse[];
} 

interface resourceDataProps {
  data: resourceProps;
}

interface resourceProps{
  id: number;
  name: string;
  type: string;
  capacity: number;
  isActive: boolean;
}

interface resourceLibraryType {
  label: string;
  value: number
}

interface SelectedResourceProps {
  id: string;
  resource: any;
  startDate: Date;
  finalDate: Date;
  fromTime: string;
  toTime: string;
  isExclusive: boolean;
}

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
}


export default function Schedule() {

  const [bookingResponse, setBookingResponse] = useState<bookingAndScheduleResponse>()

  const [isBookingResponseLoading, setIsBookingResponseLoading] = useState(true);

  const [isTermOpen, setIsTermOpen] = useState(false)

  const [isSlotLoading, setIsSlotLoading] = useState(true)

  const toast = useToast()

  const [category, setCategory] = useState("Test track");

  const [page, setPage] = useState(1)

  const [status, setStatus] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, user } = useContext(LoginContext);

  const [selectedTab, setSelectedTab] = useState('Resource')

  const [selected, setSelected] = useState([]);

  const [fromDate, setFromDate] = useState<Date>();

  const [toDate, setToDate] = useState<Date>();

  const [fromTime, setFromTime] = useState<string>('- 07:00 AM');

  const [isSelectedResourceExclusive, setIsSelectedResourceExclusive] = useState(false);

  const [toTime, setToTime] = useState<string>('- 18:00 PM');

  const [selectedResources, setSelectedResources] = useState<SelectedResourceProps[]>([])

  const { data, isLoading, error } = useQuery<resourceDataProps[]>(
    `/resource/list${page}`,
    async () => {
      const response = await api.get(
        `/resource/list?page=${page}`
      );
      const { data } = response;

      // set total count coming from response to paginate correctly

      // setTotal(20);

      console.log(data)

      return data;
    },
    {
      retry: false,
      // refetchInterval: 100000
      
    }
  );

  function deleteSelectedResource(id: string) {
    const updatedSelectedResources = selectedResources.filter((src) => src.id != id)

    setSelectedResources(updatedSelectedResources);

    return;
  }

  function updateSelectedResource() {

    console.log(fromDate, toDate, fromTime, toTime, selected)

    if (fromDate === undefined || fromTime === undefined || selected.length < 1 || toTime === undefined || toDate === undefined) {

      toast({
        title: "Select a valid resource",
        description: `Complete all fields to proceed.`,
        status: "info",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }


    const isRepeatedResource = selectedResources.find((resourceSelected) => {
      return resourceSelected.startDate === fromDate && resourceSelected.fromTime === fromTime && resourceSelected.finalDate === toDate && resourceSelected.toTime === toTime && resourceSelected.resource.every((src) => {
        const sameResource = selected.filter(srcSelected => srcSelected === src);
      })

    })

    if (!isRepeatedResource) {
      setSelectedResources([...selectedResources, {
        id: v4(),
        resource: selected,
        startDate: fromDate,
        fromTime: fromTime,
        finalDate: toDate,
        toTime: toTime,
        isExclusive: isSelectedResourceExclusive
      }])

      setIsSelectedResourceExclusive(false);
      setSelected([]);

      return;
    }

    toast({
      title: "You have already selected an appointment with the same data.",
      description: `It's necessary to change at least the resource or date to be able to schedule. `,
      status: "info",
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });

    return;
  }

  async function postBooking(){

    selectedResources.forEach(schedule => {
      const updatedResourceList: number[] = [];
      schedule?.resource.forEach(resource => {
        updatedResourceList.push(resource?.value)
      })
      schedule.resource = updatedResourceList
    })

    await api.post<bookingAndScheduleResponse>("/booking/create/schedules",{
      booking:{
        userId: user.id,
        dataInicial: selectedResources[0].startDate,
        dataFinal: selectedResources[0].finalDate,
        status: "Pre-approved",
        terms: [2]
      },
      scheduleArray: selectedResources
    })
    .then(response => {
      setBookingResponse(response.data)
      setIsBookingResponseLoading(false)
      setIsModalOpen(true)
      
    })

   
    

    // console.log(
    //   {
    //     booking: {
    //       userId: user.id,
    //       dataInicial: selectedResources[0].startDate,
    //       dataFinal: selectedResources[selectedResources.length - 1].finalDate,
    //       status: "Pre-approved",
    //       terms: [
    //         2
    //       ]
    //     },
    //     scheduleArray: [
    //       {
    //         startDate: "2023-03-24T14:04:50.458Z",
    //         finalDate: "2023-03-26T11:04:50.458Z",
    //         listResource: [
    //           2
    //         ],
    //         isExclusive: false
    //       },
    //       {
    //         startDate: "2023-04-24T14:04:50.458Z",
    //         finalDate: "2023-04-26T17:04:50.458Z",
    //         listResource: [
    //           2
    //         ],
    //         isExclusive:  true
    //       }
    //     ]
    //   }
    // )

    // console.log({
    //     userId: user.id,
    //     dataInicial: selectedResources[0].startDate,
    //     dataFinal: selectedResources[selectedResources.length - 1].finalDate,
    //     schedules: selectedResources,
    //     status: "Pre-approved",
    //     term: [],
    //   })
    // const response = await api.post("/booking/create/schedules", {
    //   booking: {
    //     userId: user.id,
    //     dataInicial: selectedResources[0].startDate,
    //     dataFinal: selectedResources[selectedResources.length - 1].finalDate,
    //     schedules: selectedResources
    //   }
    // })
  }



  const testTrackOptions = [
    { label: "VDA", value: 1 },
    { label: "Gravel track", value: 2 },
    { label: "Rough road", value: 3 },
    { label: "Highspeed track", value: 4, disabled: true },
  ];

  const officeOptions = [
    { label: "Office 1", value: "Office 1" },
    { label: "Office 2", value: "Office 2", disabled: true },
    { label: "Office 3", value: "Office 3" },
    { label: "Office 4", value: "Office 4" },
  ];

  const workshopOptions = [
    { label: "Workshop 1", value: "Workshop 1" },
    { label: "Workshop 2", value: "Workshop 2", disabled: true },
    { label: "Workshop 3", value: "Workshop 3" },
    { label: "Workshop 4", value: "Workshop 4" },
  ];


  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });


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

  // useEffect(() => {
  //   if (status == 201) {
  //     setIsModalOpen(false)
  //     toast({
  //       title: "Appointment scheduled",
  //       description: `Appointment at ${dayjs(selectedSlots[0]).format('DD/MM/YYYY')} was scheduled successfully.`,
  //       status: "success",
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'top-right'
  //     });
  //     Router.push('/userdashboard')
  //   }
  //   setStatus(0);
  // }, [status]);

  // const { data, isLoading, error } = useQuery<dataProps[]>(
  //   `SpeedwayList`,
  //   async () => {
  //     const response = await api.get(`getspeedwaylist`);
  //     const { updatedSpeedways } = response.data;

  //     return updatedSpeedways;
  //   }
  // );


  function handleCloseModal() {
    setIsModalOpen(false);
    setIsTermOpen(false)
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
          <Flex justifyContent={"start"} align="center">
            <Heading size="lg" fontWeight="normal">
              <HStack spacing={'1rem'}>
                <Button
                  w={'10rem'}
                  background={selectedTab === 'Resource' ? 'blue.500' : 'gray.900'}
                  _hover={{ opacity: 0.7 }}
                  onClick={() => updateTab('Resource')}
                >
                  Resources
                </Button>
                <Button
                  w={'10rem'}
                  background={selectedTab === 'Extra' ? 'blue.500' : 'gray.900'}
                  _hover={{ opacity: 0.7 }}
                  onClick={() => updateTab('Extra')}
                >
                  Atendees | Vehicles
                </Button>
              </HStack>

            </Heading>

          </Flex>

          <Divider my="6" borderColor="gray.700" />

          {selectedTab === 'Resource' ? (
            <Flex justifyContent={'space-between'}>
              <VStack spacing="4">
                <Text w="100%" fontSize="20" mb={3}>
                  Category
                </Text>

                <HStack spacing={'1rem'} mb={'1rem'} w={"22rem"}>
                  <ChooseVehicle onClick={() => setCategory("Test track")} isActive={category === "Test track"} vehicleType="Test track" icon={RiCarLine} />
                  <ChooseVehicle onClick={() => setCategory("Office")} isActive={category === "Office"} vehicleType="Office" icon={BiBuilding} />
                  <ChooseVehicle onClick={() => setCategory("Workshop")} isActive={category === "Workshop"} vehicleType="Workshop" icon={FiTool} />
                </HStack>

                <Flex justify={'space-between'} w='100%' align={'center'} mb='0.5rem'>
                  <Text w="100%" fontSize="20">
                    Resource
                  </Text>

                  <HStack spacing={'0.5rem'} w='100%'>
                    <Checkbox isChecked={isSelectedResourceExclusive} onChange={(e) => setIsSelectedResourceExclusive(e.target.checked)} />
                    <Text color={'gray.200'}>
                      Exclusive booking
                    </Text>
                  </HStack>
                </Flex>

                <Flex w='100%' mb={'1rem'}>

                  <MultiSelect
                    options={category === "Test track" ? testTrackOptions : category === "Office" ? officeOptions : workshopOptions}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                    className="multiSelector"
                    disableSearch
                    disabled={false}
                  />

                  {/* <Select
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
                  </Select> */}

                </Flex>


                <Text w="100%" fontSize="20">
                  Start date:
                </Text>

                <HStack spacing={'0.5rem'}>

                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'date'}
                    width='12rem'
                    onChange={(e) => setFromDate(new Date(e.target.value))}
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                  <Select onChange={(e) => setFromTime(e.target.value)} h={'3rem'} width='8rem' border={'none'} bg={'gray.900'} color={'gray.300'}>
                    <option value={'- 07:00'}>7:00</option>
                    <option value={'- 07:30'}>7:30</option>
                    <option value={'- 08:00'}>8:00</option>
                    <option value={'- 08:30'}>8:30</option>
                    <option value={'- 09:00'}>9:00</option>
                    <option value={'- 09:30'}>9:30</option>
                    <option value={'- 10:00'}>10:00</option>
                    <option value={'- 10:30'}>10:30</option>
                    <option value={'- 11:00'}>11:00</option>
                    <option value={'- 11:30'}>11:30</option>
                    <option value={'- 12:00'}>12:00</option>
                    <option value={'- 12:30'}>12:30</option>
                    <option value={'- 13:00'}>13:00</option>
                    <option value={'- 13:30'}>13:30</option>
                    <option value={'- 14:00'}>14:00</option>
                    <option value={'- 14:30'}>14:30</option>
                    <option value={'- 15:00'}>15:00</option>
                    <option value={'- 15:30'}>15:30</option>
                    <option value={'- 16:00'}>16:00</option>
                    <option value={'- 16:30'}>16:30</option>
                    <option value={'- 17:00'}>17:00</option>
                    <option value={'- 17:30'}>17:30</option>
                    <option value={'- 18:00'}>18:00</option>
                  </Select>

                </HStack>

                {/* <HStack spacing={'1rem'}>

                  <Input
                    name="FromDate"
                    color={'gray.300'}
                    type={'date'}
                    width='12rem'
                    onChange={(e) => setFromDate(new Date(e.target.value))}
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
                    name="FromTime"
                    color={'gray.300'}
                    type={'time'}
                    step={1800}
                    width='8rem'
                    onChange={(e) => setFromTime(new Date(e.target.value))}
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                </HStack> */}

                <Text w="100%" fontSize="20">
                  End date:
                </Text>

                <HStack spacing={'0.5rem'} mb='1.5rem'>
                  <Input
                    name="endDate"
                    color={'gray.300'}
                    type={'date'}
                    width='12rem'
                    onChange={(e) => setToDate(new Date(e.target.value))}
                    sx={
                      {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: 'invert(1)',
                          opacity: 0.3
                        }
                      }
                    }
                  />

                  { }

                  <Select onChange={(e) => setToTime(e.target.value)} h={'3rem'} width='8rem' border={'none'} bg={'gray.900'} color={'gray.300'}>
                    <option value={'- 07:00'}>7:00</option>
                    <option value={'- 07:30'}>7:30</option>
                    <option value={'- 08:00'}>8:00</option>
                    <option value={'- 08:30'}>8:30</option>
                    <option value={'- 09:00'}>9:00</option>
                    <option value={'- 09:30'}>9:30</option>
                    <option value={'- 10:00'}>10:00</option>
                    <option value={'- 10:30'}>10:30</option>
                    <option value={'- 11:00'}>11:00</option>
                    <option value={'- 11:30'}>11:30</option>
                    <option value={'- 12:00'}>12:00</option>
                    <option value={'- 12:30'}>12:30</option>
                    <option value={'- 13:00'}>13:00</option>
                    <option value={'- 13:30'}>13:30</option>
                    <option value={'- 14:00'}>14:00</option>
                    <option value={'- 14:30'}>14:30</option>
                    <option value={'- 15:00'}>15:00</option>
                    <option value={'- 15:30'}>15:30</option>
                    <option value={'- 16:00'}>16:00</option>
                    <option value={'- 16:30'}>16:30</option>
                    <option value={'- 17:00'}>17:00</option>
                    <option value={'- 17:30'}>17:30</option>
                    <option value={'- 18:00'}>18:00</option>
                  </Select>
                </HStack>

                <Button colorScheme={'blue'} w='100%' onClick={() => updateSelectedResource()}>Schedule</Button>
              </VStack>

              <Flex height={'100%'} maxHeight={'34.2rem'} flexDir={'column'} mt={'1.2rem'} ml={'4rem'} w={"100%"} overflowY={'scroll'} sx={
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


                {selectedResources.length > 0 ? (
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="">
                          <Text>Resources</Text>
                        </Th>

                        <Th px={["4", "4", "6"]} width="">
                          <Text>From</Text>
                        </Th>

                        <Th>To</Th>

                        <Th>Exclusive</Th>

                        <Th w="8"></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {selectedResources.map(resource => {
                        return (
                          <Tr key={resource?.id}>
                            <Td>
                              {/* {resource.listResource.map((unitResource: any) => {
                                return (
                                  <Text key={resource?.id + unitResource?.value}>{unitResource.value}</Text>
                                )
                              })} */}
                            </Td>
                            <Td>
                              {dayjs(resource.startDate).format('MMM D, YYYY ') + fromTime}
                            </Td>
                            <Td>
                              {dayjs(resource.finalDate).format('MMM D, YYYY ') + toTime}
                            </Td>

                            <Td >
                              <Text display={'flex'} align='center' justifyContent={'center'} color={resource.isExclusive ? 'blue.500' : 'gray.300'} fontWeight='bold'>
                                <IoDiamondOutline fontSize={'1.2rem'} />
                                </Text>
                            </Td>
                            <Td>
                              <Flex color={'gray.500'} fontWeight='semibold' _hover={{ color: 'red.500', cursor: 'pointer' }}>
                                <BiTrash onClick={() => deleteSelectedResource(resource.id)} size={'1.2rem'} />
                              </Flex>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>

                  </Table>
                ) : (
                  <Flex flexDir={'column'} h='34.2rem' w={'100%'} justifyContent='center' alignContent={'center'}>

                    <Flex w={'100%'} display='flex' justifyContent={'center'} >
                      <Box color={'gray.500'} display={'flex'} flexDir='column' justifyContent={'center'} alignItems='center'>
                        <BsCartX size={'4rem'} />
                        <Text fontSize={'xl'} mt='1'>
                          No feature has been selected
                        </Text>
                      </Box>
                    </Flex>


                  </Flex>
                )}


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
            <VStack spacing="8" >
              <Text w="100%" fontSize="20">
                Invite participants:
              </Text>

              <Flex w={'100%'} justify='space-between' mb={'2rem'}>
                <Flex flexDir={'column'} >
                  <Input
                    name="Participant"
                    label="Participant name"
                  />
                  <Flex mt={'1.5rem'} color={'blue.500'} justify={'start'} alignItems='center' w={'100%'} >
                    <GoPlus cursor={'pointer'} />
                    <Text _hover={
                      { color: 'blue.700' }
                    } cursor={'pointer'} color={'blue.500'} ml={'0.5rem'}>Add non registered participants</Text>
                  </Flex>
                </Flex>
                <Flex w={'100%'} background={'gray.800'} justifyContent={'end'} borderRadius='2xl'>
                  <VStack>
                    <HStack>
                      <Text w={'20rem'}>Passanger car</Text>
                      <Input w={'4rem'} name="passangerCar" />
                      <Text w={'20rem'}>Light duty truck</Text>
                      <Input w={'4rem'} name="passangerCar" />
                    </HStack>
                    <HStack>
                      <Text w={'20rem'}>Urban light bus</Text>
                      <Input w={'4rem'} name="passangerCar" />
                      <Text w={'20rem'}>Urban heavy bus</Text>
                      <Input w={'4rem'} name="passangerCar" />
                    </HStack>
                    <HStack>
                      <Text w={'20rem'}>Coach bus</Text>
                      <Input w={'4rem'} name="passangerCar" />
                      <Text w={'20rem'}>Others</Text>
                      <Input w={'4rem'} name="passangerCar" />
                    </HStack>
                  </VStack>

                </Flex>
              </Flex>


              <Flex height={'100%'} maxHeight={'22rem'} flexDir={'column'} mt={'1.2rem'} ml={'4rem'} w={"100%"} overflowY={'scroll'} sx={
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
                        <Text>Name</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Email</Text>
                      </Th>

                      <Th>CPF</Th>

                      <Th w="8"></Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    <Tr>
                      <Td>
                        João Silva Pereira
                      </Td>
                      <Td>
                        joaopereira@gmail.com
                      </Td>
                      <Td>
                        07384617819
                      </Td>
                      <Td w={'26rem'}>
                        <Flex justify={'center'} alignItems='center' w={'100%'}>
                          <Checkbox mr={'0.5rem'} />
                          <Text>Notify by e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        João Silva Pereira
                      </Td>
                      <Td>
                        joaopereira@gmail.com
                      </Td>
                      <Td>
                        07384617819
                      </Td>
                      <Td w={'26rem'}>
                        <Flex cursor={'pointer'} color={'blue.500'} justify={'center'} alignItems='center' w={'100%'} _hover={
                          { color: 'blue.700' }
                        }>
                          <GoPlus />
                          <Text ml={'0.5rem'}>Add e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        João Silva Pereira
                      </Td>
                      <Td>
                        joaopereira@gmail.com
                      </Td>
                      <Td>
                        07384617819
                      </Td>
                      <Td w={'26rem'}>
                        <Flex justify={'center'} alignItems='center' w={'100%'}>
                          <Checkbox mr={'0.5rem'} />
                          <Text>Notify by e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        João Silva Pereira
                      </Td>
                      <Td>
                        joaopereira@gmail.com
                      </Td>
                      <Td>
                        07384617819
                      </Td>
                      <Td w={'26rem'}>
                        <Flex cursor={'pointer'} color={'blue.500'} justify={'center'} alignItems='center' w={'100%'} _hover={
                          { color: 'blue.700' }
                        }>
                          <GoPlus />
                          <Text ml={'0.5rem'}>Add e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        João Silva Pereira
                      </Td>
                      <Td>
                        joaopereira@gmail.com
                      </Td>
                      <Td>
                        07384617819
                      </Td>
                      <Td w={'26rem'}>
                        <Flex cursor={'pointer'} color={'blue.500'} justify={'center'} alignItems='center' w={'100%'} _hover={
                          { color: 'blue.700' }
                        }>
                          <GoPlus />
                          <Text ml={'0.5rem'}>Add e-mail</Text>
                        </Flex>
                      </Td>
                    </Tr>


                  </Tbody>

                </Table>
              </Flex>



            </VStack>

          )}

          <Divider mt='2.5rem' borderColor="gray.700" />

          <Flex mt="2rem" justify="flex-end">
            <HStack spacing="4">
              <Link href="/home">
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
              <Button colorScheme="blue" onClick={postBooking}>
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


      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        overlayClassName="react-modal-overlay"
        className="react-modal-content-slots-confirmation"
        ariaHideApp={false}
      >

        <Flex justifyContent="flex-start">
          <Text fontSize={24} fontWeight='bold' color={'gray.100'}>Confirm appointment</Text>
        </Flex>

        <Divider my='4' />

        {isTermOpen ? (
          <>
            <Box my={"4"} border='2px' borderColor={'gray.700'} p='0.5rem' borderRadius={'0.5rem'}>
              <Text mb={2} fontSize={"md"}>
                1) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae interdum nibh, id ultricies lorem.
              </Text>
              <RadioGroup value={'2'}>
                <Stack direction='row'>
                  <Radio value='1'>True</Radio>
                  <Radio value='2'>False</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Box my={"4"} border='2px' borderColor={'gray.700'} p='0.5rem' borderRadius={'0.5rem'}>
              <Text mb={2} fontSize={"md"}>
                2) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae interdum nibh, id ultricies lorem.
              </Text>
              <RadioGroup value={'2'}>
                <Stack direction='row'>
                  <Radio value='1'>True</Radio>
                  <Radio value='2'>False</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Box my={"4"} border='2px' borderColor={'gray.700'} p='0.5rem' borderRadius={'0.5rem'}>
              <Text mb={2} fontSize={"md"}>
                3) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae interdum nibh, id ultricies lorem.
              </Text>
              <RadioGroup value={'2'}>
                <Stack direction='row'>
                  <Radio value='1'>True</Radio>
                  <Radio value='2'>False</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Box my={"4"} border='2px' borderColor={'gray.700'} p='0.5rem' borderRadius={'0.5rem'}>
              <Text mb={2} fontSize={"md"}>
                4) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae interdum nibh, id ultricies lorem.
              </Text>
              <RadioGroup value={'2'}>
                <Stack direction='row'>
                  <Radio value='1'>True</Radio>
                  <Radio value='2'>False</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <Box my={"4"} border='2px' borderColor={'gray.700'} p='0.5rem' borderRadius={'0.5rem'}>
              <Text mb={2} fontSize={"md"}>
                5) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae interdum nibh, id ultricies lorem.
              </Text>
              <RadioGroup value={'2'}>
                <Stack direction='row'>
                  <Radio value='1'>True</Radio>
                  <Radio value='2'>False</Radio>
                </Stack>
              </RadioGroup>
            </Box>

            <HStack spacing={4} justify='end'>
              <Button onClick={handleCloseModal} colorScheme='whiteAlpha'>
                Cancel
              </Button>


              <Button type="submit" colorScheme="blue" onClick={() => {
                toast({
                  title: "Aguardando integração do sistema",
                  description: `Previsão de entrega: 01/03/2023 `,
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right'
                });
              }}>
                Submit
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <Flex mb={'2rem'} maxH={'30rem'} flexDir={'column'} mt={'1.2rem'} w={"100%"} overflowY={'scroll'} sx={
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
                  <Tr >
                    <Th px={["4", "4", "6"]} color="gray.300" width="">
                      <Text>Id</Text>
                    </Th>

                    <Th px={["4", "4", "6"]} width="">
                      <Text>From</Text>
                    </Th>

                    <Th>To</Th>

                    {isWideVersioon && <Th >Recursos</Th>}
                    

                    <Th w="8"></Th>
                  </Tr>
                </Thead>

                <Tbody >
                  {bookingResponse?.schedules.map(schedule => {
                    return (
                      <Tr  key={schedule.id} background={schedule.status === "Pre-approved" ? '' : 'red.500'}>
                    <Td>
                      {schedule.id}
                    </Td>
                    <Td>
                      {dayjs(schedule.startDate).format('MMMM D, YYYY h:mm A')}
                    </Td>
                    <Td>
                    {dayjs(schedule.finalDate).format('MMMM D, YYYY h:mm A')}
                    </Td>
                    <Td>
                      VDA
                    </Td>
                    <Td>
                      <HStack spacing={'0.8rem'}>
                        {schedule.isExclusive? (
                          <Flex color={'blue.500'} justifyContent={'center'} alignItems={'center'} minW={'7rem'} fontWeight={'semibold'}>
                          <Text>Exclusive</Text>
                        <MdDownloadDone size={'1.5rem'}/>
                        </Flex>
                        ) : (
                          <Button minW={'7rem'} colorScheme={'blackAlpha'} _hover={{bg: 'blue.500'}}>
                          Exclusive
                        </Button>
                        )}
                        <Button colorScheme={'red'}>
                          Excluir
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                    )
                  })}
                  


                </Tbody>

              </Table>
            </Flex>

            <HStack spacing={4} justify='end'>
              <Button onClick={handleCloseModal} colorScheme='whiteAlpha'>
                Cancel
              </Button>


              <Button type="submit" colorScheme="blue" onClick={() => setIsTermOpen(true)}>
                Next
              </Button>
            </HStack>
          </>

        )}


      </Modal>

    </Box >

  );
}


// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const { auth } = parseCookies(ctx)

//   const decodedUser = decode(auth as string) as DecodedToken;


//   const necessaryPermissions = ["SCHEDULE"]

//   if (necessaryPermissions?.length > 0) {
//     const hasAllPermissions = necessaryPermissions.some(permission => {
//       return decodedUser?.permissions?.includes(permission)
//     })


//     if (!hasAllPermissions) {
//       return {
//         redirect: {
//           destination: '/home',
//           permanent: false
//         }
//       }
//     }

//   }

// -------------------------------------------------------

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


  // --------------------------------------

//   return {
//     props: {}
//   }
// }
