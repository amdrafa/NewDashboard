import {
  Box,
  Button,
  Flex,
  Text,
  Image
} from "@chakra-ui/react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/footer";
import Carousel from 'nuka-carousel'

export default function Home() {
  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" mt="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        <Box display={'flex'} flexDir='column' flex="1" height={"100%"} borderRadius={8} p="8" maxW={1100} justifyContent='center'>
          <Flex justifyContent={'space-between'}>
            <Box w={"60%"} >
              <Text fontSize={"6xl"} color="gray.100" fontWeight="semibold">
                Ready for
              </Text>

              <Text
                mt={-9}
                fontSize={"6xl"}
                color="gray.100"
                fontWeight="semibold"
              >
                Schedule a
              </Text>

              <Text
                mt={-9}
                fontSize={"6xl"}
                color="green.600"
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
                color="green.400"
                fontWeight="normal"
                mt={-2}
              >
                Part of the group!
              </Text>
              </Box>
              
              <Link href={'/schedule'}>
              <Button ml={1.5} mt={8} colorScheme={'green'} w={'64'} h='12' rounded={'full'}>
                    SCHEDULE NOW
                </Button>
              </Link>
                
              
            </Box>

            <Box w={'80%'}>
            <Image src="images/about-hero-right1.png"/>
            </Box>
          </Flex>

          <Box w={'100%'} py={12} bg={'gray.800'} px='4' rounded={'lg'} mt='10'> 
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
          </Carousel>
            
          </Box>
        </Box>
      </Flex>

      <Flex >
        <Flex  w={{lg: '275px'}}></Flex>
      <Footer />
      </Flex>
      
    </Box>
  );
}
