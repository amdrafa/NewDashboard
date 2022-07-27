import { Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { api } from "../services/axios";



  interface ApprovalProps {
    slot: string;
    timeLabel: string;
    isBusy: boolean;
    isCurrentUserAppointment: boolean;
  }

export function ApprovalTimeCard({slot, timeLabel, isBusy, isCurrentUserAppointment}: ApprovalProps){


    return (
        <Text
              mb={2}
              display={'flex'}
              justifyContent={'center'}
              color={"gray.100"}
              fontWeight={"bold"}
              ml='2'
              p={2}
              rounded='lg'
              bg={isCurrentUserAppointment ? 'blue.500' : isBusy? 'red.400' : 'gray.900'}
              _hover={isCurrentUserAppointment ? {bg: 'blue.600', cursor: 'pointer'} : isBusy? {bg: 'red.500', cursor: 'not-allowed'} : {bg: 'green.500', cursor: 'pointer'}}
            >
              {dayjs(slot).format("H")}:00 to{" "}
              {Number(dayjs(slot).format("H")) + 1}:00
            </Text>
    );
}