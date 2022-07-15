import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Day } from "./Day";


interface MonthProps {
    month: any;
    addTimeSlot: (slot: string) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Month({month, addTimeSlot, selectedSlots, setSelectedSlots}:MonthProps){

    return (         // Let teams apparence, horizontal direction
                    // flex={'1'} gridTemplateColumns={'repeat(7, 1fr)'}
        <Flex >
            {month.map((row: [], i: number) => (
                <Flex flexDirection={'row'} key={i}>
                    {row.map((day, idx) => (
                        <Day  
                        day={day}
                        key={idx}
                        rowIdx={i}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        />
                    ))}
                </Flex>
            ))}
        </Flex>
    )
}