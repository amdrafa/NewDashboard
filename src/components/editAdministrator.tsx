import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Text,
    VStack,
    useToast
  } from "@chakra-ui/react";
  import Modal from "react-modal";
  import Link from "next/link";
  import { Input } from "../components/Form/input";
  import { Header } from "../components/Header";
  import { Sidebar } from "../components/Sidebar";
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { api } from "../services/axios";
  import { useEffect, useState } from "react";
  import { IoMdClose } from "react-icons/io";
  import { FaUnlockAlt } from "react-icons/fa";
  import { FiTrash2 } from "react-icons/fi";
  
  type EditAdmFormData = {
    name: string;
    email: string;
    cpf: number;
    workRole: string;
    admId: string;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const EditAdmFormSchema = yup.object().shape({
    name: yup.string().required(),  
    email: yup.string().required().email(),
    cpf: yup.number().required().min(11, 'Minimum 11 letters.'),
    role: yup.string().required()
  })
  
  export default function EditAdministrator({
    admId,
    cpf,
    email,
    name,
    setIsEditMode,
    workRole
  }: EditAdmFormData) {

    const toast = useToast()

    const { register, handleSubmit, formState, resetField } = useForm({
      resolver: yupResolver(EditAdmFormSchema),
    });
  
    const [isModalOpen, setIsModalOpen] = useState(false);

    function deleteAdm(id: string){
        api.delete('deleteadministrator', {data: {id}})
        .then((response) => {
          toast({
            title: "Administrator deleted",
            description: `${name} was deleted successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
          window.location.reload()
        })
        .catch((err) => {
          toast({
            title: "Something went wrong",
            description: `${name} was couldn't be deleted.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        });
      }
  
    const { errors } = formState;
  
    const handleEditAdm: SubmitHandler<EditAdmFormData> = async ({
      name,
      admId,
      cpf,
      email,
      workRole
    }) => {
      await api
        .put("editcompany", {
          
        })
        .then((response) => {
          toast({
            title: "Administrator updated",
            description: `${name} was updated successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        })
        .catch((err) => {
          toast({
            title: "Something went wrong",
            description: `${name} couldn't be deleted.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
        });
    };
  
    // function deleteCompany(id: string){
    //   api.delete('deletecompany', {data: {id}})
    //   .then((response) => {
    //     toast.success("company deleted");
    //     window.location.reload()
    //   })
    //   .catch((err) => {
    //     toast.error("Something went wrong");
    //   });
    // }
  
    
  
    return (
        <Box as='form' flex='1' height={'100%'} borderRadius={8} bg='gray.800' p='8' mt={5} onSubmit={handleSubmit(handleEditAdm)}>

<Flex justify={'space-between'} align='center'>
      <Heading size="lg" fontWeight="normal">
        Edit administrator
      </Heading>
      <Button bg='red.500' _hover={{bg:'red.400'}} onClick={() => setIsModalOpen(true)}>
            <Icon mr={1.5} as={FiTrash2} />
            Delete administrator
          </Button>
      </Flex>

        <Divider my="6" borderColor="gray.700"/>

        <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input name="name" label="Full name" {...register('name')} error={errors.name} defaultValue={name} isDisabled/>
                <Input name="email" label="E-mail" type={"email"} {...register('email')} error={errors.email} defaultValue={email} isDisabled/>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input name="cpf" label="CPF" type="number" {...register('cpf')} error={errors.cpf} defaultValue={cpf} isDisabled/>
                <Box>
                <Input name="role" label="Role" {...register('role')} error={errors.role} defaultValue={workRole} isDisabled/>
                <Text ml={2} mt={2} color="gray.500">Ex: Financial analyst</Text>
                </Box>
            </SimpleGrid>
        </VStack>

        <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
                
                <Button onClick={() => {
                    setIsEditMode(false)
                }} colorScheme="whiteAlpha">Cancel</Button>
                
                <Button isDisabled isLoading={formState.isSubmitting} type="submit" colorScheme="blue">Save</Button>
                
            </HStack>
        </Flex>

        <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-delete-message"
        ariaHideApp={false}
      >
        <SimpleGrid
          flex="1"
          gap="1"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            mb={2}
          >
            <Text fontSize={"2xl"}>Delete administrator</Text>
            <Icon
              fontSize={20}
              as={IoMdClose}
              onClick={() => {
                setIsModalOpen(false);
              }}
              cursor={"pointer"}
            />
          </Box>
          <Divider orientation="horizontal" />

          <Box my={"4"}>
            <Text mb={2} fontSize={"md"}>
              Do you really want to delete this administrator? All his accesses are going to be retrieved from the platform.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              An e-mail will be sent for the deleted administrator informing that it was deleted.
            </Text>
          </Box>

          <Flex justify={"flex-end"}>
            <HStack spacing={4}>
              <Button
                type="submit"
                onClick={() => setIsModalOpen(false)}
                colorScheme={"whiteAlpha"}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                    deleteAdm(admId)
                    return ;
                }}
                colorScheme={"red"}
              >
                Delete
              </Button>
            </HStack>
          </Flex>
        </SimpleGrid>
      </Modal>
    </Box>
        
      
    );
  }
  