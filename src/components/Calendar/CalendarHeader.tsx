import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react"
import dayjs from "dayjs"
import { useContext } from "react"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { CalendarContext } from "../../contexts/CalendarContext"

export function CalendarHeader(){

    const { monthIndex, setMonthIndex } = useContext(CalendarContext)

    function handlePrevMonth(){
        setMonthIndex(monthIndex - 1)
    }

    function handleNextMonth(){
        setMonthIndex(monthIndex + 1)
    }

    function handleResetDate(){
        setMonthIndex(dayjs().month())
    }

    return (
        <Flex  px={'4'} alignItems='center'> 
            
            <Button onClick={() => {handleResetDate()}} rounded={'base'} py='2' px='4' mr='5' colorScheme={'blue'}>
                Today
            </Button>
            
            <Icon onClick={() => {handlePrevMonth()}} fontSize={22} cursor={'pointer'} as={RiArrowLeftSLine}/>
            
            
            <Icon onClick={() => {handleNextMonth()}} fontSize={22} cursor={'pointer'} as={RiArrowRightSLine}/>

            <Text ml={4} color={'gray.100'}>
                {(dayjs(new Date(dayjs().year(), monthIndex))).format('MMMM YYYY')}
            </Text>
        </Flex>
    )
}