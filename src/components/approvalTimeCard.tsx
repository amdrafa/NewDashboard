import { Text } from "@chakra-ui/react";
import dayjs from "dayjs";

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
              bg={isCurrentUserAppointment ? 'blue.500' : isBusy? 'red.500' : 'gray.900'}
              _hover={isCurrentUserAppointment ? {bg: 'blue.600', cursor: 'not-allowed'} : isBusy? {bg: 'red.600', cursor: 'not-allowed'} : {bg: 'gray.700', cursor: 'not-allowed'}}
            >
              {dayjs(slot).format("H")}:00 to{" "}
              {Number(dayjs(slot).format("H")) + 1}:00
            </Text>
    );
}