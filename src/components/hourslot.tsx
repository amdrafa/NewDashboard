import { Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

interface slotInterface {
  slot: string;
}

interface HourSlotProps {
    isSelected: boolean;
    isAvaiable: boolean;
    hourSlot: string;
    hourSlotLabel: string;
    userClick: React.Dispatch<React.SetStateAction<boolean>>;
    addTimeSlot: (slot: string) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
}

export function HourSlot({isSelected, isAvaiable, hourSlot, userClick, hourSlotLabel, addTimeSlot, selectedSlots, setSelectedSlots}: HourSlotProps) {


  return (
    <Flex
      mb={2}
      justify={"center"}
      p={"2"}
      w={"100%"}
      border={"1px"}
      borderColor="blackAlpha.300"
      bg={isAvaiable ?  isSelected ? 'blue.500' : 'gray.800' : 'red.400'}
      rounded="md"
      cursor={isAvaiable ? 'pointer' : "not-allowed"}
      _hover={isAvaiable ? {bg: 'blue.500'} : {bg: 'red.500'} }
      onClick={() => {
        isSelected ? userClick(false) : userClick(true)

        console.log(hourSlot)

        addTimeSlot(hourSlot)

        console.log(hourSlot)

        console.log(selectedSlots)
      }}
    >
      <Text>{hourSlot}</Text>
    </Flex>
  );
}
