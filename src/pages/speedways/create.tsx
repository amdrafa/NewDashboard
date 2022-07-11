import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup' 
import { api } from "../../services/axios";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

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

    const { register, handleSubmit, formState, resetField } = useForm({
        resolver: yupResolver(createSpeedwayFormSchema)
    })

    const {errors} = formState

    const handleCreateSpeedway: SubmitHandler<CreateSpeedwayFormData> = async ({speedway, vehicles_limit, description }) => {
        
        console.log(speedway, vehicles_limit, description)
        
        await api.post('createspeedway', {data: speedway, vehicles_limit, description})
        .then(response => {

            toast.success('Speedway created')

            resetField('speedway')
            resetField('vehicles_limit')
            resetField('description')
        })
        .catch(err => {
            toast.error('Something went wrong')
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
        </Box>
    );
}