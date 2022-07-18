import { Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
}



export function HourSlot({isSelected, hourSlot, userClick, hourSlotLabel, addTimeSlot, selectedSlots, setSelectedSlots, setIsSlotLoading}: HourSlotProps) {

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
      setIsSlotLoading(isLoadingBusylots)
        return ;
    }else{
      setIsSlotLoading(isLoadingBusylots)
        setIsAvaiable(dataBusySlots.busySlots.find(slot => slot == hourSlot) ? true : false)
    }

}, [isLoadingBusylots])

  

  return (
    <Flex
      mb={2}
      justify={"center"}
      p={"2"}
      w={"100%"}
      border={"1px"}
      borderColor="blackAlpha.300"
      bg={!isAvaiable ?  isSelected ? 'blue.500' : 'gray.800' : 'red.400'}
      rounded="md"
      cursor={!isAvaiable ? 'pointer' : "not-allowed"}
      _hover={!isAvaiable ? {bg: 'blue.500'} : {bg: 'red.500'} }
      onClick={() => {
        isSelected ? userClick(false) : userClick(true)

        console.log(hourSlot)

        addTimeSlot(hourSlot)

        console.log(hourSlot)

        console.log(selectedSlots)
      }}
    >
      <Text>{hourSlotLabel}</Text>
    </Flex>
  );
}
