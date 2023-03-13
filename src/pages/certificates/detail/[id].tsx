import {
    Flex,
    Button,
    Icon,
    Divider,
    Text,
    VStack,
    SimpleGrid,
    Box,
    Heading,
    HStack,
    useToast,
    Checkbox,
    Select,
    Link,
  } from "@chakra-ui/react";
  import { Input } from "../../../components/Form/input";
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { api } from "../../../services/axios";
  import { useContext, useState } from "react";
  import { LoginContext } from "../../../contexts/LoginContext";
  import { FiTool, FiTrash2 } from "react-icons/fi";
  import dayjs from "dayjs";
  import { useQuery } from "react-query";
  import { useRouter } from "next/router";
  import { Header } from "../../../components/Header";
  import { Sidebar } from "../../../components/Sidebar";
  import { MdDone } from "react-icons/md";
  import { AiOutlineClose } from "react-icons/ai";
  import { BiBuilding } from "react-icons/bi";
  import { RiCarLine } from "react-icons/ri";
  import { ChooseVehicle } from "../../../components/ChooseVehicle";
  
  interface certificateProps {
    id?: number;
    certificateName: string;
    certificateCode: string;
    certificateType: string;
    createdAt?: string;
  }

  interface certificateFormProps {
    name: string;
    code: string;
  }
  
  const EditCertificateFormSchema = yup.object().shape({
    name: yup.string().required(),
    code: yup.string(),
  });
  
  export default function EditCertificates() {
    const router = useRouter();
    const id = Number(router.query.id);
  
    const [selectedType, setSelectedType] = useState("Default");
  
    const {
      data: certificateData,
      isLoading: isCertificateLoading,
      error: errorCertificate,
    } = useQuery<certificateProps>(
      `certificates${id}`,
      async () => {
        const response = await api.get(`/certificate/list/${id}`);
        console.log(response.data);
        setSelectedType(response.data.certificateType);

        return response.data;
      },
      {
        enabled: !!id,
      }
    );
  
    const toast = useToast();
  
    const { register, handleSubmit, formState } = useForm({
      resolver: yupResolver(EditCertificateFormSchema),
    });
  
    const { errors, isSubmitting } = formState;
  
    const handleEditCertificate: SubmitHandler<certificateFormProps> = async ({
        name,
        code
      }) => {
        console.log(name, code)
        // await api
        //   .post("/certificate/create", {
        //     certificateName: certificateName,
        //     certificateType: certificateType,
        //     certificateCode: certificateCode? certificateCode : null
        //   })
        //   .then((response) => {
        //     toast({
        //       title: "Certificate created",
        //       description: `Certificate was created successfully.`,
        //       status: "success",
        //       duration: 5000,
        //       isClosable: true,
        //       position: "top-right",
        //     });
    
        //    router.push('/certificates')
        //   })
        //   .catch((err) => {
        //       console.log(err)
        //     toast({
        //       title: "Something went wrong",
        //       description: `Error when adding certificate.`,
        //       status: "error",
        //       duration: 5000,
        //       isClosable: true,
        //       position: "top-right",
        //     });
        //   });
    };
  
    async function deleteCertificate() {
      await api
        .delete(`/certificate/delete/${id}`)
        .then((response) => {
          toast({
            title: "Certificate deleted",
            description: `${certificateData?.certificateName} was deleted successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          router.push("/certificates");
        })
        .catch((err) => {
          toast({
            title: "Something went wrong",
            description: `Something went wrong when deleting ${certificateData?.certificateName}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
    }
  
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
            onSubmit={handleSubmit(handleEditCertificate)}
          >
            <Flex justify={'space-between'} align='center'>
              <Heading size="lg" fontWeight="normal">
                Edit certificate
              </Heading>
  
              <Button
                color={"gray.400"}
                onClick={deleteCertificate}
                bg="gray.900"
                _hover={{ bg: "red.500", color: "white" }}
              >
                <Icon mr={1.5} as={FiTrash2} />
                Delete certificate
              </Button>
            </Flex>
  
            <Divider my="6" borderColor="gray.700" />
  
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  defaultValue={certificateData?.certificateName}
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
                    defaultValue={certificateData?.certificateCode}
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
                  colorScheme="blue"
                  type="submit"
                >
                  Save
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Flex>
      </Box>
    );
  }
  