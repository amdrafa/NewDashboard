import { Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { api } from "../services/axios";

interface busySlotsProps {
  busySlots: []
}

interface HourSlotProps {
    isSelected: boolean;
    hourSlot: string;
    hourSlotLabel: string;
    userClick: React.Dispatch<React.SetStateAction<boolean>>;
    addTimeSlot: (slot: string) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
    setIsSlotLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sameDay: boolean;
}



export function HourSlot({isSelected, hourSlot, userClick, hourSlotLabel, addTimeSlot, selectedSlots, setSelectedSlots, setIsSlotLoading, sameDay}: HourSlotProps) {

  
  const [isAnotherDay, setIsAnotherDay] = useState(false)
  

  const [isAvaiable, setIsAvaiable] = useState(false)

  const { data: dataBusySlots, isLoading: isLoadingBusylots, error: errorBusylots } = useQuery<busySlotsProps>(
    `busySlotsList`,
    async () => {
      const response = await api.get(`getbusyslots`);
      
     
      return response.data;
    }
  );

useEffect(() => {
    
    if(isLoadingBusylots){
        return ;
    }else{
        setIsAvaiable(dataBusySlots.busySlots.find(slot => slot == hourSlot) ? false : true)

        // setIsAvaiable(selectedSlots.length > 0 && dataBusySlots.busySlots.find(slot => Number(dayjs(slot).format('D')) == Number(dayjs(hourSlot).format('D'))) ? true : false)
    }

    

}, [isLoadingBusylots, selectedSlots])

  useEffect(() => {
    if(selectedSlots.length > 0 && sameDay == false){
      setIsAvaiable(false)
    }
  }, [selectedSlots])




  return (
    <Flex
      mb={2}
      justify={"center"}
      p={"2"}
      w={"100%"}
      border={"1px"}
      borderColor="blackAlpha.300"
      bg={isLoadingBusylots ? 'gray.900' : (isAvaiable ?  isSelected ? 'green.500' : 'gray.800' : 'red.400')}
      rounded="md"
      cursor={isAvaiable ? '-webkit-grab' : "not-allowed"}
      _hover={isAvaiable ? {bg: 'blue.500'} : {bg: 'red.500'} }
      onClick={() => {
        
        isSelected? userClick(false) : userClick(true)

        if(dayjs(selectedSlots[0]).format('D') != dayjs(hourSlot).format('D') && selectedSlots.length > 0){
          userClick(false)
          toast.info('You can schedule only one day at time')
          return ;
        }

        // if(selectedSlots.length == 0){
        //   setSelectedDay(Number(dayjs(hourSlot).format('D')))
        // }
        


        if(isAvaiable){
          addTimeSlot(hourSlot)
        }


      }}
    >
      <Text color={isLoadingBusylots? 'gray.500' : ''}>{hourSlotLabel}</Text>
    </Flex>
  );
}
