import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup' 

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }
  
  const createUserFormSchema = yup.object().shape({
    name: yup.string().required(),  
    email: yup.string().required().email(),
    password: yup.string().required().min(6, 'Minimum 6 letters.'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], "The passwords need to be the same")
  })


export default function CreateUser(){

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema)
    })

    const {errors} = formState

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log(values)
    }

    return (
        <Flex direction="column" h="100vh">
            <Header />

            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <Sidebar />

                <Box as='form' flex='1' borderRadius={8} bg='gray.800' p='8' onSubmit={handleSubmit(handleCreateUser)}>

                    <Heading size="lg" fontWeight="normal">Create user</Heading>

                    <Divider my="6" borderColor="gray.700"/>

                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input name="name" label="Full name" {...register('name')} error={errors.name} />
                            <Input name="email" label="E-mail" type={"email"} {...register('email')} error={errors.email}/>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input name="password" type="password" label="Password" {...register('password')} error={errors.password}/>
                            <Input name="password_confirmation" type="password" label="Password confirmation" {...register('password_confirmation')} error={errors.password_confirmation}/>
                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button as={"a"} colorScheme="whiteAlpha">Cancel</Button>
                            </Link>
                            <Button isLoading={formState.isSubmitting} type="submit" colorScheme="blue">Save</Button>
                            
                        </HStack>
                    </Flex>


                </Box>
            </Flex>
        </Flex>
    );
}