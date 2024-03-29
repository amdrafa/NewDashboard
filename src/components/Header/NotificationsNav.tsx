import {
  HStack,
  Text,
  Icon,
  Popover,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  Link,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { BsCheckCircle, BsExclamationCircle, BsFillCircleFill } from "react-icons/bs";
import { RiNotificationLine } from "react-icons/ri";
import { LoginContext } from "../../contexts/LoginContext";
import { MyPopoverTrigger } from "../PopOverTriggerComponent";

export function NotificationsNav() {

  const {user} = useContext(LoginContext);

  return (
    <>
      <HStack
        spacing="8"
        mx={["6", "8"]}
        pr={["6", "8"]}
        py="1"
        color="gray.300"
        borderRightWidth={1}
        borderColor="gray.700"
      >
        <Popover placement={"bottom-end"}>
          <MyPopoverTrigger>
            <Link>
            {(user?.companyRef == '' || !user?.driver_expiration || new Date(user?.driver_expiration) <= new Date()) && <Icon as={BsFillCircleFill} mt='-4' fontSize="6" color={'red.500'} /> }
            
              <Icon as={RiNotificationLine} fontSize="20" />
            </Link>
          </MyPopoverTrigger>

          <PopoverContent
            color="white"
            bg="#292A36"
            borderColor="blackAlpha.200"
            shadow={"2xl"}
            mt={2}
            
          >
            <PopoverHeader pt={4} fontWeight="bold" border="0">
              <Text fontSize={17}>Notifications</Text>
            </PopoverHeader>
              {(user?.companyRef == '' || new Date(user?.driver_expiration) <= new Date() ) ? (
                
              <Box>
              
                {user?.companyRef == '' && (
                  <Link style={{ textDecoration: 'none' }} href="/company" >
                  <Flex borderTop={'1px'} borderColor='gray.700' alignItems={"center"} pr={2} py={2}  cursor={'pointer'} _hover={{bg: "#21222c"}}>
                    

                  <Flex p={4}>
                    <Icon  fontSize={30} as={BsExclamationCircle} color={"blue.500"}/>
                  </Flex>

                  <Box >
                    <Text fontWeight={600} fontSize={16} color={'blue.500'}>Company necessary</Text>
                    <Text pr={1.5} fontSize={14} color={'gray.300'}>You have to be part of a company to be able to schedule the speedways.</Text>
                  </Box>

                  </Flex>
                  </Link>
                )}


                {user?.driver_expiration?  (
                  ''
                ) : (
                  <Link style={{ textDecoration: 'none' }} href="/driverlicence"  >
                  <Flex borderTop={'1px'} borderColor='gray.700' alignItems={"center"} pr={2} py={2} cursor={'pointer'} _hover={{bg: "#21222c"}}>

                  <Flex p={4}>
                    <Icon fontSize={30} as={BsExclamationCircle} color={"blue.500"}/>
                  </Flex>

                  <Box >
                    <Text fontWeight={600} fontSize={16} color={'blue.500'}>Register driver licence</Text>
                    <Text pr={1.5} fontSize={14} color={'gray.300'}>Go to the configurations page and update the informations.</Text>
                  </Box>

                  </Flex>
                  </Link>
                )}



                {user?.driver_expiration && (
                  new Date(user?.driver_expiration) <= new Date() ? (
                    <Link style={{ textDecoration: 'none' }} href="/driverlicence" > 
                  <Flex borderTop={'1px'} borderColor='gray.700' alignItems={"center"} pr={2} py={3} cursor={'pointer'} _hover={{bg: "#21222c"}}>

                  <Flex p={4}>
                    <Icon fontSize={30} as={BsExclamationCircle} color={"blue.500"}/>
                  </Flex> 

                  <Box>
                    <Text fontWeight={600} fontSize={16} color={'blue.500'}>Driver licence expired</Text>
                    <Text pr={1.5} fontSize={14} color={'gray.300'}>Go to the configurations page and update the informations</Text>
                  </Box>

                  </Flex>
                  </Link>
                  ) : ('')
                 
                )}


                </Box>
                
              ) : (<Flex px={4} justifyContent={"center"} mt={4} mb={6}>
              <Box justifyContent={"center"}>
                <Flex w={"100%"} justifyContent={"center"}>
                  <Icon
                    as={BsCheckCircle}
                    fontSize={40}
                    color={"blue.500"}
                    mb={3}
                  />
                </Flex>

                <Text fontWeight={800}>You don't have any notification.</Text>
              </Box>
            </Flex>)}

            <PopoverCloseButton />
          </PopoverContent>
        </Popover>
      </HStack>
    </>
  );
}


