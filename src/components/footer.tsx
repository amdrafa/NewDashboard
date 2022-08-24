import { ReactNode } from 'react';

import {
  Box,
  Container,
  Flex,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Logo } from './Header/Logo';


const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export function Footer() {
  return (
    <Flex
      w={'100%'}
      mx={{sm: '6', lg: '6'}}
      mb={8}
      bg={'gray.800'}
      rounded='3xl'
      color={'gray.400'}
      mt='20'
      
      >
      <Container as={Stack} maxW={'1200px'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr' }}
          spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Logo />
            </Box>
            <Text fontSize={'sm'}>
            Bosch © 2022 . All rights reserved
            </Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Contact</ListHeader>
            <Link href={'#'}>ctvi@services.com</Link>
            <Link href={'#'}>Website</Link>
            <Link href={'#'}>Instagram</Link>
            <Link href={'#'}>Facebook</Link>
            <Link href={'#'}>Twitter</Link>
            
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>CTVI</ListHeader>
            <Link href={'#'}>Pricing</Link>
            <Link href={'#'}>Credits</Link>
            <Link href={'#'}>Contract</Link>
            <Link href={'#'}>Schedule</Link>
            <Link href={'#'}>Help</Link>
          </Stack>
          
        </SimpleGrid>
      </Container>
    </Flex>
  );
}