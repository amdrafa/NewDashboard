import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import  Router  from "next/router";
import { useEffect, useState } from "react";
import { MdSpeed } from "react-icons/md";


export default function successredirect() {

  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {
    setTimeout(()=> {Router.push('/')}, 4000)
    
  }, [])

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Flex
        w="100%"
        maxW={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        
      >

        <Flex display="grid" alignItems="center" justifyContent="center" mb={6}>
        <Spinner />
        </Flex>
        <Flex alignItems="center" justifyContent="center">
            <Text fontSize={25} color="blue.500" fontWeight="700">Registration Successful!</Text>
            
        </Flex>

        <Flex alignItems="center" justifyContent="center">
            <Text fontSize={16} color="gray.200">Redirecting to login page...</Text>
        </Flex>
        
      </Flex>

      <Flex>
        
        <Text></Text>
      </Flex>

      
    </Flex>
  );
}
