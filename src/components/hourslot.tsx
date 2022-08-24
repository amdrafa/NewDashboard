import { Flex, Text, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CalendarContext } from "../contexts/CalendarContext";
import { api } from "../services/axios";

interface busySlotsProps {
  busySlots: [];
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
  testTrack: string;
  day: dayjs.Dayjs;
}

export function HourSlot({
  isSelected,
  hourSlot,
  userClick,
  hourSlotLabel,
  addTimeSlot,
  selectedSlots,
  setSelectedSlots,
  setIsSlotLoading,
  sameDay,
  day,
  testTrack,
}: HourSlotProps) {
  const toast = useToast();

  const { monthIndex } = useContext(CalendarContext);

  const [isAnotherDay, setIsAnotherDay] = useState(false);

  const [isAvaiable, setIsAvaiable] = useState(true);

  const {
    data: dataBusySlots,
    isLoading: isLoadingBusylots,
    error: errorBusylots,
  } = useQuery<busySlotsProps>(`busySlotsList`, async () => {
    const response = await api.get(`getbusyslots?testtrack=${testTrack}`);

    return response.data;
  });

  useEffect(() => {
    if (isLoadingBusylots) {
      return;
    } else {
      setIsAvaiable(
        dataBusySlots?.busySlots.find((slot) => slot == hourSlot) ? false : true
      );

      // setIsAvaiable(selectedSlots.length > 0 && dataBusySlots.busySlots.find(slot => Number(dayjs(slot).format('D')) == Number(dayjs(hourSlot).format('D'))) ? true : false)
    }
  }, [isLoadingBusylots, selectedSlots, monthIndex, day]);

  useEffect(() => {
    if (selectedSlots.length > 0 && sameDay == false) {
      setIsAvaiable(false);
    }
  }, [selectedSlots]);

  return (
    <Flex
      mb={2}
      justify={"center"}
      p={"2"}
      w={"100%"}
      border={"1px"}
      borderColor="blackAlpha.300"
      bg={
        isLoadingBusylots
          ? "gray.900"
          : isAvaiable
          ? isSelected
            ? "green.500"
            : "gray.800"
          : "red.500"
      }
      rounded="md"
      cursor={isAvaiable ? "-webkit-grab" : "not-allowed"}
      _hover={isAvaiable ? { bg: "blue.500" } : { bg: "red.600" }}
      onClick={() => {
        isSelected ? userClick(false) : userClick(true);

        if (
          dayjs(selectedSlots[0]).format("D") != dayjs(hourSlot).format("D") &&
          selectedSlots.length > 0
        ) {
          userClick(false);
          toast({
            title: "Invalid option",
            description: `You can schedule only one day at time`,
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }

        // if(selectedSlots.length == 0){
        //   setSelectedDay(Number(dayjs(hourSlot).format('D')))
        // }

        if (isAvaiable) {
          addTimeSlot(hourSlot);
        }
      }}
    >
      <Text color={isLoadingBusylots ? "gray.500" : ""}>{hourSlotLabel}</Text>
    </Flex>
  );
}
