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

        <Box flex="1" borderRadius={8} bg="gray.800" height='100%' p="8" mt={8}>

        <Flex>
          RC3 COMING SOON...
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
        <Flex w={{ lg: '275px' }}></Flex>
        <Footer />
      </Flex>

    </Box>
  );
}
