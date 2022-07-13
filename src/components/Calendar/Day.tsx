import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

interface DayProps {
    day: dayjs.Dayjs;
    rowIdx: number;
}

// dayjs.Dayjs = type for day js

export function Day({day, rowIdx}:DayProps){

    console.log(day)

    function getCurrentDay(){
        return day.format('DD-MM-YY') == dayjs().format('DD-MM-YY') ? 'blue.600' : 'blackAlpha.300'
    }

    function getCurrentDayColor(){
        return day.format('DD-MM-YY') == dayjs().format('DD-MM-YY') ? 'blue.600' : ''
    }


    return (
        <>
            {(day.format('DD-MM-YY') >= dayjs().format('DD-MM-YY') && day.format('MM') == dayjs().format('MM')) || day.format('MM') > dayjs().format('MM') ? (
                <Flex height={'100%'} pt={'4'} border={'4px'} borderColor={'gray.900' } direction={'column'} rounded='lg' bg={'blackAlpha.300'} m='1' w={'200px'} p='2'>
                <Flex  flexDirection={'column'} alignItems='center'>
    
                    
                    <Text fontWeight={'semibold'} mt='1'>
                        {day.format('ddd')}
                    </Text>
                    
                
                
                    <Text bgColor={getCurrentDayColor()} rounded='full' px={2} py={1} mb='4'>
                        {day.format('DD')}
                    </Text>
    
    
                    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'green.600'}} cursor='pointer'>
                        <Text>
                            8:00am - 9:00am
                        </Text>
                    </Flex>
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'green.600'}} cursor='pointer'>
                        <Text>
                            9:00am - 10:00am
                        </Text>
                    </Flex>
                    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'green.600'}} cursor='pointer'>
                        <Text>
                            10:00am - 11:00am
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'green.600'}} cursor='pointer'>
                        <Text>
                            11:00am - 12:00am
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'red.400'} rounded='md' cursor={'not-allowed'}>
                        <Text>
                            12:00am - 13:00pm
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md'_hover={{bg: 'green.600'}} cursor='pointer'>
                        <Text>
                            13:00pm - 14:00pm
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'blue.600'}} cursor='pointer'>
                        <Text>
                        14:00pm - 15:00pm
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'blue.600'}} cursor='pointer'>
                        <Text>
                            15:00pm - 16:00pm
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'blue.600'}} cursor='pointer'>
                        <Text>
                            16:00pm - 17:00pm
                        </Text>
                    </Flex>
    
                    <Flex mb={2} justify={'center'} p={'2'} w={'100%'} border={'1px'} borderColor='blackAlpha.300' bg={'gray.800'} rounded='md' _hover={{bg: 'blue.600'}} cursor='pointer'>
                        <Text>
                            17:00pm - 18:00pm
                        </Text>
                    </Flex>
    
                    
                    {/* <Flex>
                        <Text>
                            9:00am - 10:00am
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            10:00am - 11:00am
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            11:00am - 12:00am
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            12:00am - 13:00pm
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            13:00pm - 14:00pm
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            14:00pm - 15:00pm
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            15:00pm - 16:00pm
                        </Text>
                    </Flex>
                    <Flex>
                        <Text>
                            16:00pm - 17:00pm
                        </Text>
                    </Flex> */}
    
                </Flex>
                
                
            </Flex>
            ) : ('')}
        </>
    )
}