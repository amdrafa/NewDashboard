import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    Icon,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useBreakpointValue,
    Input,
    Spinner,
    Divider,
    HStack,
    SimpleGrid,
    Image,
    useToast
  } from "@chakra-ui/react";
  import Modal from "react-modal";
  import Link from "next/link";
  import {useState, useEffect } from "react";
  import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
  import { FiTrash } from "react-icons/fi";
  import { Header } from "../../components/Header";
  import { Pagination } from "../../components/Pagination";
  import { Sidebar } from "../../components/Sidebar";
  import { api } from "../../services/axios";
  import { useQuery } from "react-query";
import { IoMdClose } from "react-icons/io";
import EditAdministrator from "../../components/editAdministrator";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import { Footer } from "../../components/footer";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
}

  
  interface AdmDataProps {
    data: AdmProps;
    ref: {
      "@ref": {
        id: string;
      } 
    }
    ts: number;
  }
  
  interface AdmProps {
    name: string;
    email: string;
    workRole: string;
    cpf: number;
    
  }

  interface AdmEditProps {
    name: string;
    email: string;
    workRole: string;
    cpf: number;
    admId: string;
    
  }
  
  export default function AdmList() {
    const isWideVersioon = useBreakpointValue({
      base: false,
      lg: true,
    });
    const toast = useToast()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setcpf] = useState(0);
    const [role, setRole] = useState('');
    const [admId, setAdmId] = useState('');

    const [isEditMode, setIsEditMode] = useState(false);
  
    const [page, setPage] = useState(1);
  
    const [limit, setLimit] = useState(6);
  
    const [total, setTotal] = useState(1);
  
    const [users, setUsers] = useState<AdmDataProps[]>([]);
    
    function handleEditAdm({
      cpf,
      email,
      name,
      workRole,
      admId
    }: AdmEditProps){
      
    setName(name)
    setcpf(cpf)
    setEmail(email)
    setRole(workRole)
    setAdmId(admId)
    

    setIsEditMode(true);

    return;
    }

    function deleteAdm(id: string){
      
    api.delete('deleteadm', {data: {id}})
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
        description: `${name} couldn't be deleted.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    });

    }
  
    const { data, isLoading, error } = useQuery<AdmDataProps[]>(
      `admlist${page}`,
      async () => {
        const response = await api.get(`getalladms?page=${page}&limit=${limit}`);
        const { PaginateData: ReturnedData, totalcount } = response.data;
        console.log(ReturnedData);
        
        setTotal(totalcount)
        return ReturnedData;
      }
    );
  
    
  
    return (
      <Box mt={-3}>
        <Header />
  
        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
          
          {isEditMode ? (
            <EditAdministrator 
            admId={admId}
            cpf={cpf}
            email={email}
            name={name}
            setIsEditMode={setIsEditMode}
            workRole={role}
            />
          ) : (
            <Box flex="1" borderRadius={8} bg="gray.800" height={'100%'} p="8" mt={5}>
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Administrators list
              </Heading>
  
              <Link href="/administrators/create" passHref>
              <Button
                size="sm"
                fontSize="sm"
                colorScheme="blue"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Add a new administrator
              </Button>
            </Link>
            </Flex>
  
            
            {isLoading ? (
            <Flex justify="center">
              <Spinner mt="70px" mb="110px" />
            </Flex>
            ): error ? (
              <Flex justify="center">
                <Text>The requisition failed</Text>
              </Flex>
            ): (
              
              total > 0 ? (<>
              <Flex minHeight={'400px'} flexDir={'column'} justifyContent='space-between'>
                <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["4", "4", "6"]} color="gray.300" width="">
                    <Text>Administrator</Text>
                  </Th>
                  <Th>CPF</Th>
                  <Th>Role</Th>
                  {isWideVersioon && <Th>Register date</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((adm) => (
                    <Tr key={adm.ts} onClick={() => {
                      handleEditAdm({
                        cpf: adm.data.cpf,
                        email: adm.data.email,
                        name: adm.data.name,
                        workRole: adm.data.workRole,
                        admId: adm.ref["@ref"].id
                      })
                      return ;
                    }} _hover={{bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer'}}
                    >
                    <Td px={["4", "4", "6"]}>
                      <Box>
                        <Text fontWeight="bold">{adm.data.name}</Text>
                        <Text fontSize="sm" color="gray.300">
                        {adm.data.email}
                        </Text>

                      </Box>
                    </Td>
                    <Td>
                      <Text>{adm.data.cpf}</Text>
                    </Td>
                    <Td>{adm.data.workRole}</Td>
                    {isWideVersioon && <Td>18 de maio, 2022</Td>}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              totalCountOfRegisters={total}
              currentPage={page}
              onPageChanges={setPage}
            />
            </Flex>
                </>) : (
                  <Flex w="100%" alignItems={'center'} justifyContent="center" minH={'400px'} cursor={'not-allowed'}>
                  <Box justifyContent="center" mb={8}>
                    <Flex justifyContent={'center'}>
                      <Image opacity={0.4} src='images/noappointments.png' w={'200px'}/>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={24} fontWeight="bold" color={'blackAlpha.400'}>
                        There is not any administrator registered.
                      </Text>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={18} color={'blackAlpha.400'} fontWeight='semibold'>
                        Create an administrator and an e-mail will be sent with his temporary password.
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                )
              
            )} 
            
            
          </Box>
          )}
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
  
  