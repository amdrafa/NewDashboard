import { Flex } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../contexts/CalendarContext";
import { getMonth } from "../../util";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarSidebar } from "./CalendarSideBar";
import { Month } from "./Month";


interface CalendarIndexProps{
    addTimeSlot: (slot: string) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
    setIsSlotLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CalendarIndex({addTimeSlot, selectedSlots, setSelectedSlots, setIsSlotLoading}:CalendarIndexProps){

    const [ currentMonth, setCurrentMonth] = useState(getMonth())

    const { monthIndex } = useContext(CalendarContext)

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex))
    }, [monthIndex])

    return (
        <>
            <Flex
            height={'100%'}
            flex={'1'}
            flexDirection={'column'}
            >
                
                <Flex flex={'1'}>
                    
                    <Month 
                    month={currentMonth}
                    addTimeSlot={addTimeSlot}
                    selectedSlots={selectedSlots}
                    setSelectedSlots={setSelectedSlots}
                    setIsSlotLoading={setIsSlotLoading}
                    />
                </Flex>
            </Flex>
        </>
    );
}