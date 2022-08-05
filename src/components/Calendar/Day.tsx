import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../services/axios";
import { HourSlot } from "../hourslot";



interface DayProps {
    day: dayjs.Dayjs;
    rowIdx: number;
    addTimeSlot: (slot:string) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
    setIsSlotLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sameDay: boolean;
    testTrack: string;
}

// dayjs.Dayjs = type for day js

export function Day({day, rowIdx, addTimeSlot, selectedSlots, setSelectedSlots, setIsSlotLoading, sameDay, testTrack}:DayProps){

    
    const [slot8AmIsSelected, setSlot8AmIsSelected] = useState(false)
    const [slot9AmIsSelected, setSlot9AmIsSelected] = useState(false)
    const [slot10AmIsSelected, setSlot10AmIsSelected] = useState(false)
    const [slot11AmIsSelected, setSlot11AmIsSelected] = useState(false)
    const [slot12AmIsSelected, setSlot12AmIsSelected] = useState(false)
    const [slot13AmIsSelected, setSlot13AmIsSelected] = useState(false)
    const [slot14AmIsSelected, setSlot14AmIsSelected] = useState(false)
    const [slot15AmIsSelected, setSlot15AmIsSelected] = useState(false)
    const [slot16AmIsSelected, setSlot16AmIsSelected] = useState(false)
    const [slot17AmIsSelected, setSlot17AmIsSelected] = useState(false)


    function getCurrentDay(){
        return day.format('DD-MM-YY') == dayjs().format('DD-MM-YY') ? 'blue.600' : 'blackAlpha.300'
    }

    function getCurrentDayColor(){
        return day.format('DD-MM-YY') == dayjs().format('DD-MM-YY') ? 'blue.600' : ''
    }

    return (
        <>
            {(day.format('DD-MM-YY') >= dayjs().format('DD-MM-YY') && day.format('MM') == dayjs().format('MM')) || day.format('MM') > dayjs().format('MM') || day.format('YYYY') > dayjs().format('YYYY')? (
                <Flex height={'100%'} pt={'4'} border={'4px'} borderColor={'gray.900' } direction={'column'} rounded='lg' bg={'blackAlpha.300'} m='1' w={'200px'} p='2'>
                <Flex  flexDirection={'column'} alignItems='center'>
    
                    
                    <Text fontWeight={'semibold'} mt='1'>
                        {day.format('ddd')}
                    </Text>
                    
                
                
                    <Text bgColor={getCurrentDayColor()} rounded='full' px={2} py={1} mb='4'>
                        {day.format('DD')}
                    </Text>
    
    
                    <HourSlot 
                        isSelected={slot8AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 8).toString()}
                        hourSlotLabel='8:00am - 9:00am'
                        userClick={setSlot8AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot9AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 9).toString()}
                        hourSlotLabel='9:00am - 10:00am'
                        userClick={setSlot9AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot10AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 10).toString()}
                        hourSlotLabel='10:00am - 11:00am'
                        userClick={setSlot10AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot11AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 11).toString()}
                        hourSlotLabel='11:00am - 12:00am'
                        userClick={setSlot11AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot12AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 12).toString()}
                        hourSlotLabel='12:00am - 13:00pm'
                        userClick={setSlot12AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot13AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 13).toString()}
                        hourSlotLabel='13:00pm - 14:00pm'
                        userClick={setSlot13AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot14AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 14).toString()}
                        hourSlotLabel='14:00pm - 15:00pm'
                        userClick={setSlot14AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot15AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 15).toString()}
                        hourSlotLabel='15:00pm - 16:00pm'
                        userClick={setSlot15AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot16AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 16).toString()}
                        hourSlotLabel='16:00pm - 17:00pm'
                        userClick={setSlot16AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />

                    <HourSlot 
                        isSelected={slot17AmIsSelected}
                        hourSlot={new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('D')), 17).toString()}
                        hourSlotLabel='17:00pm - 18:00pm'
                        userClick={setSlot17AmIsSelected}
                        addTimeSlot={addTimeSlot}
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                        setIsSlotLoading={setIsSlotLoading}
                        sameDay={sameDay}
                        day={day}
                        testTrack={testTrack}
                    />
    
                    
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