import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    VStack,
    useToast,
    Select,
    Checkbox,
    Text,
  } from "@chakra-ui/react";
  import Link from "next/link";
  import { Input } from "../../components/Form/input";
  import { Header } from "../../components/Header";
  import { Sidebar } from "../../components/Sidebar";
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { api } from "../../services/axios";
  import { decode } from "jsonwebtoken";
  import { GetServerSideProps } from "next";
  import { parseCookies } from "nookies";
  import { Footer } from "../../components/footer";
  import { ChooseVehicle } from "../../components/ChooseVehicle";
  import { RiCarLine } from "react-icons/ri";
  import { BiBuilding } from "react-icons/bi";
  import { FiTool } from "react-icons/fi";
  import { useState } from "react";
  import { useRouter } from "next/router";
  
  export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    name: string;
  };
  
  interface CertificateProps {
    name: string;
    code: string;
  }
  
  const createCertificateFormSchema = yup.object().shape({
    name: yup.string().required(),
    code: yup.string()
  });
  
  export default function CreateCertificate() {
    const toast = useToast();
  
    const router = useRouter()
  
    const [selectedType, setSelectedType] = useState('Upload')
  
    const { register, handleSubmit, formState, resetField } = useForm({
      resolver: yupResolver(createCertificateFormSchema),
    });
  
    const { errors } = formState;
  
    const handleCreateCertificate: SubmitHandler<CertificateProps> = async ({
      name,
      code,
    }) => {
      await api
        .post("/certificate/create", {
          certificateName: name,
          certificateType: selectedType,
          certificateCode: code? code : null
        })
        .then((response) => {
          toast({
            title: "Certificate created",
            description: `Certificate was created successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
  
         router.push('/certificates')
        })
        .catch((err) => {
            console.log(err)
          toast({
            title: "Something went wrong",
            description: `Error when adding certificate.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
    };
  
    return (
      <Box mt={-3}>
        <Header />
  
        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
  
          <Box
            as="form"
            flex="1"
            height={"100%"}
            borderRadius={8}
            bg="gray.800"
            p="8"
            mt={5}
            onSubmit={handleSubmit(handleCreateCertificate)}
          >
            <Heading size="lg" fontWeight="normal">
              Add a certificate
            </Heading>
  
            <Divider my="6" borderColor="gray.700" />
  
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="name"
                  label="Name"
                  {...register("name")}
                  error={errors.name}
                />
              </SimpleGrid>
  
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%" alignItems={'center'}>
                <Box align={'center'} w='100%' justify={'center'}>
                  <HStack  w='100%' mt={'0.5rem'} spacing='1.5rem'>
                    <ChooseVehicle
                      isActive={selectedType === 'Upload'}
                      vehicleType="Upload"
                      icon={RiCarLine}
                      onClick={() => setSelectedType('Upload')}
                    />
                    <ChooseVehicle
                      isActive={selectedType === 'AdminApprove'}
                      vehicleType="Admin approval"
                      icon={BiBuilding}
                      onClick={() => setSelectedType('AdminApprove')}
                    />
                    <ChooseVehicle
                      isActive={selectedType === 'Script'}
                      vehicleType="Script"
                      icon={FiTool}
                      onClick={() => setSelectedType('Script')}
                    />
                  </HStack>
                </Box>
                <Box>
                  <Input
                    h={'6rem'}
                    name="code"
                    label="Script"
                    {...register("code")}
                    error={errors.code}
                    mb='0.5rem'
                    isDisabled={selectedType !== "Script"}
                  />
                  
                </Box>
              </SimpleGrid>
            </VStack>
  
            <Flex mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/certificates" passHref>
                  <Button as={"a"} colorScheme="whiteAlpha">
                    Cancel
                  </Button>
                </Link>
                <Button
                  isLoading={formState.isSubmitting}
                  type="submit"
                  colorScheme="blue"
                >
                  Save
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
  
        <Flex>
          <Flex w={{ lg: "275px" }}></Flex>
          <Footer />
        </Flex>
      </Box>
    );
  }
  
  // export const getServerSideProps: GetServerSideProps = async (ctx) => {
  
  //     const {auth} = parseCookies(ctx)
  
  //     const decodedUser = decode(auth as string) as DecodedToken;
  
  //     const necessaryRoles = ['ADMINISTRATOR']
  
  //     if(necessaryRoles?.length > 0){
  //       const hasAllRoles = necessaryRoles.some(role => {
  //         return decodedUser?.roles?.includes(role)
  //     });
  
  //     if(!hasAllRoles){
  //       console.log(hasAllRoles)
  //       return {
  //         redirect: {
  //           destination: '/home',
  //           permanent: false
  //         }
  //       }
  //     }
  //     }
  
  //     return {
  //       props: {}
  //     }
  //   }
  