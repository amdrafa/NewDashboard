import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack, Text, useToast } from "@chakra-ui/react";
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
import { GetServerSideProps } from "next";
import { decode } from "jsonwebtoken";
import { parseCookies } from "nookies";
import { Footer } from "../../components/footer";

export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    name: string;
  }

type CreateAdmFormData = {
    name: string;
    email: string;
    cpf: string;
    role: string;
  }
  
  const createAdmFormSchema = yup.object().shape({
    name: yup.string().required(),  
    email: yup.string().required().email(),
    cpf: yup.string().required().min(11, 'Minimum 11 letters.'),
    role: yup.string().required()
  })


export default function CreateAdm(){

    const toast = useToast()

    const { register, handleSubmit, formState, resetField } = useForm({
        resolver: yupResolver(createAdmFormSchema)
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

            toast({
                title: "Administrator created",
                description: `${name} was created successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
              });
            resetField('name')
            resetField('email')
            resetField('cpf')
            resetField('role')
            
        }catch(err){
            toast({
                title: "E-mail already registered",
                description: `${email} is already registered in the database.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-right'
              });
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