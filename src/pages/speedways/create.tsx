import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup' 
import { api } from "../../services/axios";
import { decode } from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Footer } from "../../components/footer";

export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    name: string;
  }


type CreateSpeedwayFormData = {
    speedway: string;
    vehicles_limit: number;
    description: string;
  }
  
  const createSpeedwayFormSchema = yup.object().shape({
    speedway: yup.string().required(),  
    vehicles_limit: yup.number().required(),
    description: yup.string().required().min(10, 'Minimum 10 letters.'),
  })


export default function CreateSpeedway(){

    const toast = useToast()

    const { register, handleSubmit, formState, resetField } = useForm({
        resolver: yupResolver(createSpeedwayFormSchema)
    })

    const {errors} = formState

    const handleCreateSpeedway: SubmitHandler<CreateSpeedwayFormData> = async ({speedway, vehicles_limit, description }) => {
        
        await api.post('createspeedway', {data: speedway, vehicles_limit, description})
        .then(response => {

            toast({
                title: "Test track created",
                description: `Test track was created successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
              });

            resetField('speedway')
            resetField('vehicles_limit')
            resetField('description')
        })
        .catch(err => {
            toast({
                title: "Something went wrong",
                description: `An unknown error has occurred.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
              });
        })

        
    }

    return (
        <Box mt={-3}>
            <Header />

            <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
                <Sidebar />

                <Box as='form' flex='1' height={"100%"} borderRadius={8} bg='gray.800' p='8' mt={5} onSubmit={handleSubmit(handleCreateSpeedway)}>

                    <Heading size="lg" fontWeight="normal">Add a Speedway</Heading>

                    <Divider my="6" borderColor="gray.700"/>

                    <VStack spacing="8">
                        
                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input  name="speedway" label="Speedway name" {...register('speedway')} error={errors.speedway} />
                            <Input type="number" name="vehicles_limit" label="Vehicles limit" {...register('vehicles_limit')} error={errors.vehicles_limit}/>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input height="100" name="description" label="Description" {...register('description')} error={errors.description}/>
                            
                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/speedways" passHref>
                                <Button as={"a"} colorScheme="whiteAlpha">Cancel</Button>
                            </Link>
                            <Button isLoading={formState.isSubmitting} type="submit" colorScheme="blue">Save</Button>
                            
                        </HStack>
                    </Flex>


                </Box>
            </Flex>

            <Flex >
        <Flex  w={{lg: '275px'}}></Flex>
      <Footer />
      </Flex>
        </Box>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const {auth} = parseCookies(ctx)
  
    const decodedUser = decode(auth as string) as DecodedToken;
  
    const necessaryRoles = ['ADMINISTRATOR']
    
    if(necessaryRoles?.length > 0){
      const hasAllRoles = necessaryRoles.some(role => {
        return decodedUser?.roles?.includes(role)
    });
  
    if(!hasAllRoles){
      console.log(hasAllRoles)
      return {
        redirect: {
          destination: '/home',
          permanent: false
        }
      }
    }
    }
  
    
    return {
      props: {}
    }
  }