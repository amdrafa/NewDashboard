import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Day } from "./Day";

interface MonthProps {
    month: number[]
}

export function Month({month}){

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
                        />
                    ))}
                </Flex>
            ))}
        </Flex>
    )
}