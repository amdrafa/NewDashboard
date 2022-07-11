import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup' 
import { useContext } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import { api } from "../../services/axios";
import Router from "next/router";
import { toast } from "react-toastify";

type CreateAdmFormData = {
    name: string;
    email: string;
    cpf: number;
    role: string;
  }
  
  const createUserFormSchema = yup.object().shape({
    name: yup.string().required(),  
    email: yup.string().required().email(),
    cpf: yup.number().required().min(11, 'Minimum 11 letters.'),
    role: yup.string().required()
  })


export default function CreateAdm(){

    const { register, handleSubmit, formState, resetField } = useForm({
        resolver: yupResolver(createUserFormSchema)
    })

    const {errors} = formState

    const { user } = useContext(LoginContext)

    const handleCreateUser: SubmitHandler<CreateAdmFormData> = async ({name, email, cpf, role}) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        try{
            const response = await api.post('createadministrator', {
                name, 
                email, 
                cpf,
                workRole: role,
                createdBy: user.userId
            })

            toast.success('Administrator created')
            resetField('name')
            resetField('email')
            resetField('cpf')
            resetField('role')
            
        }catch(err){
            toast.error('E-mail already registered')
            console.log(err)
        }
        
    }

    return (
        <Box mt={-3} >
            <Header />

            <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6" >
                <Sidebar />

                <Box as='form' flex='1' height={'100%'} borderRadius={8} bg='gray.800' p='8' mt={5} onSubmit={handleSubmit(handleCreateUser)}>

                    <Heading size="lg" fontWeight="normal">Create administrator</Heading>

                    <Divider my="6" borderColor="gray.700"/>

                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input name="name" label="Full name" {...register('name')} error={errors.name}  />
                            <Input name="email" label="E-mail" type={"email"} {...register('email')} error={errors.email}/>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                            <Input name="cpf" label="CPF" type="number" {...register('cpf')} error={errors.cpf}/>
                            <Box>
                            <Input name="role" label="Role" {...register('role')} error={errors.role}/>
                            <Text ml={2} mt={2} color="gray.500">Ex: Financial analyst</Text>
                            </Box>
                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/administrators" passHref>
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