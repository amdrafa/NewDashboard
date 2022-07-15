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
    Link as ChakraLink,
    Spinner,
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
  import { FaTruckMonster } from "react-icons/fa";
  import { IoMdArrowDropdown } from "react-icons/io";
  import Modal from "react-modal";
  import { LoginContext } from "../contexts/LoginContext";
  import { api } from "../services/axios";
  import Router from "next/router";
  import { errors } from "faunadb";
  import { ChooseVehicle } from "../components/ChooseVehicle";
  import { useQuery } from "react-query";
  import { toast } from "react-toastify";
import { CalendarIndex } from "../components/Calendar";
import { CalendarHeader } from "../components/Calendar/CalendarHeader";
  
  interface speedwayProps{
    speedway: string;
    vehicles_limit: number;
    description: string;
  }
  
  interface dataProps{
    data: speedwayProps;
    ref: string;
    ts: number;
  }
  
  export default function Schedule() {
   
  
    const [speedway, setSpeedway] = useState("");
    const [vehicle, setVehicle] = useState("Light vehicle");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
  
    const [status, setStatus] = useState(0)
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  
    const [speedwayList, setSpeedwayList] = useState<speedwayProps>();
  
    const { isAuthenticated, user } = useContext(LoginContext)
  
    useEffect(() => {
      status == 200 && toast.success("Appointment scheduled") 
      setStatus(0)
    }, [status])
    
    
    const { data, isLoading, error } = useQuery<dataProps[]>(`SpeedwayList`, async () => {
      const response = await api.get(`getspeedwaylist`)
      const {speedways} = response.data;
      
      return speedways;
    });
    
    console.log(data)
  
    function handleOpenModal() {
      setIsModalOpen(true);
    }
  
    function handleCloseModal() {
      setIsModalOpen(false);
    }
  
    const handleSelect = (ranges) => {
      setStartDate(ranges.selection.startDate);
      setEndDate(ranges.selection.endDate);
    };
  
    const selectionRange = {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    };
  
    console.log(startDate, endDate, speedway, vehicle);
  
    async function CreateSchedule(event:FormEvent) {
  
      event.preventDefault()
  
      if(speedway  == ''){
        toast.error('Complete all required fields')
        return;
      }
      
      
      
      await api.post('scheduletime', {startDate, endDate, vehicle, speedway, userId: user.userId})
      .then(response => setStatus(response.status))
      .catch(err => {
        console.log(err)
        toast.error('Something went wrong')
      })
  
      setVehicle('Light vehicle')
      setSpeedway('Select option')
      setStartDate(new Date())
      setEndDate(new Date())
       
    }
    return (
      <Box >
        <Header />
        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
          <SimpleGrid w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Box bg={'gray.800'} rounded='md' p={2} mb='-1'>
            <CalendarHeader />
            </Box>
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
  } border={'8px'} borderColor='gray.800' overflowX={'auto'} maxW='calc(100wh)' as="form" flex="1" borderRadius={8} bg="gray.800" py="2" mt={5} onSubmit={CreateSchedule} h='100%' marginTop={'0'}>
            
            <Box>
            <CalendarIndex  />
            </Box>
            
          </Box>
          </SimpleGrid>
        </Flex>
      </Box>
    );
  }
  