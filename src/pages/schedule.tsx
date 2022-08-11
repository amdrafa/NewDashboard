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
  Input,
  Link,
  useToast,
  Link as ChakraLink,
  Spinner,
  useBreakpointValue,
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
import { GiMineTruck } from "react-icons/gi";
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

  function AddTimeSlot(slot: string){
    
  let updatedSlots = [...selectedSlots]

  const slotIndex = updatedSlots.findIndex(registeredSlot => registeredSlot === slot)
    

  if(slotIndex >= 0){
    updatedSlots.splice(slotIndex, 1)
    setSelectedSlots(updatedSlots)
  }else{
    if(dayjs(selectedSlots[0]).format('D') == dayjs(slot).format('D') || selectedSlots.length == 0){
      setIsSameDay(true)
      updatedSlots.push(slot)
      setSelectedSlots(updatedSlots)
    }else{
      setIsSameDay(false)
    }
    
  }

  }

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });


  const [speedway, setSpeedway] = useState("");
  const [vehicle, setVehicle] = useState("Light vehicle");

  const [page, setPage] = useState(1)

  const [status, setStatus] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, user } = useContext(LoginContext);

  useEffect(() => {
    if(page == 2){
      setTimeout(() => {
        setIsSlotLoading(false);
      }, 4000)
    }
    
  }, [page])

  useEffect(() => {
    if(status == 200){
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


  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
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

        {page == 1? (
           <Box
           flex="1"
           borderRadius={8}
           bg="gray.800"
           p="8"
           mt={5}
         >
           <Flex justifyContent={"space-between"} align="center">
             <Heading size="lg" fontWeight="normal">
               Schedule
             </Heading>
             
 
             <Box mr={1}>
               <Icon fontSize={12} mr={2} color={"blue.500"} as={FaCircle} />
               <Icon fontSize={12} as={FaCircle} color={"gray.600"} />
             </Box>
           </Flex>
 
           <Divider my="6" borderColor="gray.700" />
 
           <VStack spacing="8">
             <Text w="100%" fontSize="20">
               Select a vehicle:
             </Text>
 
             <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
               <ChooseVehicle
                 icon={RiCarLine}
                 vehicleType="Light vehicle"
                 onClick={() => {
                   setVehicle("Light vehicle");
                 }}
                 isActive={vehicle == "Light vehicle"}
               />
 
               <ChooseVehicle
                 icon={FaTruckMonster}
                 vehicleType="Heavy vehicle"
                 onClick={() => {
                   setVehicle("Heavy vehicle");
                 }}
                 isActive={vehicle == "Heavy vehicle"}
               />
 
               <ChooseVehicle
                 icon={GiMineTruck}
                 vehicleType="Truck"
                 onClick={() => {
                   setVehicle("Truck");
                 }}
                 isActive={vehicle == "Truck"}
               />
 
               <ChooseVehicle
                 icon={RiMotorbikeLine}
                 vehicleType="Motorcycle"
                 onClick={() => {
                   setVehicle("Motorcycle");
                 }}
                 isActive={vehicle == "Motorcycle"}
               />
             </SimpleGrid>
 
             <Text ml="1" w="100%" fontSize="18">
               Test track
             </Text>
             <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
               <Select
                 mt="-4"
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
             </SimpleGrid>
           </VStack>
 
           <Flex mt="8" justify="flex-end">
             <HStack spacing="4">
               <Link href="/home">
                 <Button colorScheme="whiteAlpha">Cancel</Button>
               </Link>
               <Button colorScheme="blue" onClick={() => {

                {speedway == '' ? (toast({
                  title: "Select a test track",
                  description: `You need to select a test track to proceed.`,
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                  position: 'top-right'
                })) : (
                  setPage(2)
                )}

                
               }}>
                 Next
               </Button>
             </HStack>
           </Flex>
         </Box>
        ) : (
          
          <Box
           borderRadius={8}
           bg="gray.800"
           p="8"
           mt={5}
           height='100%'
           w={isWideVersioon ? '' : '100%'}
         >
           <Flex justifyContent={"space-between"} align="center" minW={'1180'}>
            <Flex>
            <Heading mr={4} size="lg" fontWeight="normal">
               Schedule
             </Heading>
             {/* {selectedSlots.map(slot => (slot))} */}
             <CalendarHeader />
            </Flex>
             
 
             <Box mr={1}>
               <Icon fontSize={12} mr={2} color={"gray.600"} as={FaCircle} />
               <Icon fontSize={12} as={FaCircle} color={"blue.500"} />
             </Box>
           </Flex>
 
           <Divider my="6" borderColor="gray.700" />
 
           <Box sx={
            { "&::-webkit-scrollbar": {
                width: "4px",
                
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "blackAlpha.400",
                borderRadius: "24px",
              },
            }
  } border={'8px'} borderColor='gray.800' overflowX={'auto'} maxW={1180} as="form" flex="1" borderRadius={8} bg="gray.800" py="2" mt={5} onSubmit={CreateSchedule} h='100%' marginTop={'0'}>
            
            <Box>
                {isSlotLoading? (
                  <Flex w={'1170px'} justifyContent='center'>
                    <Spinner my={'32'}/>
                  </Flex>
                ) : (
                  <CalendarIndex
                  addTimeSlot={AddTimeSlot}
                  selectedSlots={selectedSlots}
                  setSelectedSlots={setSelectedSlots}
                  setIsSlotLoading={setIsSlotLoading}
                  sameDay={isSameDay}
                  testTrack={speedway}
                  />
                )}
              
            </Box>
            
          </Box>
 
           <Flex mt="4" justify="flex-end">
             <HStack spacing="4">
          
              <Button onClick={() => {
                setPage(1)
                setSelectedSlots([])
                window.location.reload();
                }} colorScheme="whiteAlpha">Back</Button>
               
               <Button colorScheme="blue" onClick={() => {
                  selectedSlots.length <= 0? toast({
                    title: "Select a slot",
                    description: `You need to select at least one slot.`,
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                  }) : setIsModalOpen(true)
                }}>
                 Next
               </Button>
             </HStack>
           </Flex>
           <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          overlayClassName="react-modal-overlay"
          className="react-modal-content"
          ariaHideApp={false}
        >
          <SimpleGrid
            as={'form'}
            flex="1"
            gap="1"
            minChildWidth="320px"
            alignItems="flex-start"
            onSubmit={CreateSchedule}
          >
            <Flex justifyContent="flex-start">
              <Text fontSize={24} fontWeight='bold' color={'gray.100'}>Confirm appointment</Text>
            </Flex>

            <Box my='4'>
            <Divider/>
            <Text mt={6} mb={2} fontSize={18} >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.
            </Text>
            </Box>

            <HStack spacing={4} justify='end'>
            <Button onClick={handleCloseModal} colorScheme='whiteAlpha'>
                  Cancel
                </Button>
              

              <Button type="submit" colorScheme="green">
                Confirm
              </Button>
            </HStack>
          </SimpleGrid>
        </Modal>
           
         </Box> 
         )}
      </Flex>

      
      <Flex >
        <Flex  w={{lg: '275px'}}></Flex>
      <Footer />
      </Flex>
      
      
    </Box>
    
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const {auth} = parseCookies(ctx)

  const decodedUser = decode(auth as string) as DecodedToken;


  const necessaryPermissions = ["SCHEDULE"]

  if(necessaryPermissions?.length > 0){
    const hasAllPermissions = necessaryPermissions.some(permission => {
      return decodedUser?.permissions?.includes(permission)
    })


    if(!hasAllPermissions){
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
