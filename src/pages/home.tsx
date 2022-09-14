import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useBreakpointValue,
  Heading
} from "@chakra-ui/react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/footer";
import Carousel from 'nuka-carousel'

export default function Home() {

  const isWideVersioon = useBreakpointValue({
    base: false,
    md: false,
    lg: true,
  });
  
  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" mt="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" height='100%'  p="8" mt={8}>
          

            <Flex mt={10} justifyContent={'space-between'} mx='auto' display={isWideVersioon? 'flex' : 'inline'} px={6} pb={14} >
            <Box mr={16} display='flex' flexDir={'column'} w='400px' mt={4}>
              <Text fontSize={"5xl"} color="gray.100" fontWeight="semibold">
                Ready for
              </Text>

              <Text
                mt={-9}
                fontSize={"5xl"}
                color="gray.100"
                fontWeight="semibold"
              >
                Schedule a
              </Text>

              <Text
                mt={-8}
                fontSize={"5xl"}
                color="red.600"
                fontWeight="bold"
              >
                TEST TRACK
              </Text>

              <Box ml={1.5}>
              <Text
                fontSize={"xl"}
                color="gray.200"
                fontWeight="normal"
              >
                Buy some hours and become
              </Text>

              <Text
                fontSize={"xl"}
                color="green.300"
                fontWeight="normal"
                mt={-2}
              >
                Part of the group!
              </Text>
              </Box>
              
              <Link href={'/schedule'}>
              <Button ml={1.5} mt={12} colorScheme={'green'} w={'64'} h='12' rounded={'full'}>
                    SCHEDULE NOW
                </Button>
              </Link>
                
              
            </Box>

            <Box mt={isWideVersioon? '' : '20'}>
            <Image alt="main image" w={'500px'} src="images/pista.png"/>
            </Box>

            
          </Flex>

            </Box>

        
          

{/*            
          <Carousel  autoplay={true} enableKeyboardControls wrapAround={true}
    slidesToShow={3} cellSpacing={16}>
          <Box w={'100%'} display='flex' flexDir={'column'} justifyContent={'center'} alignItems='center' pb='8'>
          <Image height={'260px'} src="https://posvenda.pt/wp-content/uploads/2015/10/contidrom.jpg"/>
          <Text mt={4} color='gray.100' fontWeight={'bold'} fontSize={26} >HSO</Text>
          </Box>
          <Box w={'100%'} display='flex' flexDir={'column'} justifyContent={'center'} alignItems='center'>
          <Image height={'260px'} src="https://posvenda.pt/wp-content/uploads/2015/10/contidrom.jpg"/>
          <Text mt={4} color='gray.100' fontWeight={'bold'} fontSize={26} >BMT</Text>
          </Box>
          <Box w={'100%'} display='flex' flexDir={'column'} justifyContent={'center'} alignItems='center'>
          <Image height={'260px'} src="https://posvenda.pt/wp-content/uploads/2015/10/contidrom.jpg"/>
          <Text mt={4} color='gray.100' fontWeight={'bold'} fontSize={26} >VDA</Text>
          </Box>
          <Box w={'100%'} display='flex' flexDir={'column'} justifyContent={'center'} alignItems='center'>
          <Image height={'260px'} src="https://posvenda.pt/wp-content/uploads/2015/10/contidrom.jpg"/>
          <Text mt={4} color='gray.100' fontWeight={'bold'} fontSize={26} >PHC</Text>
          </Box>
          <Box w={'100%'} display='flex' flexDir={'column'} justifyContent={'center'} alignItems='center'>
          <Image height={'260px'} src="https://posvenda.pt/wp-content/uploads/2015/10/contidrom.jpg"/>
          <Text mt={4} color='gray.100' fontWeight={'bold'} fontSize={26} >Comfort Lane</Text>
          </Box>
          </Carousel> */}
            
          
        
      </Flex>

      <Flex >
        <Flex  w={{lg: '275px'}}></Flex>
      <Footer />
      </Flex>
      
    </Box>
  );
}
