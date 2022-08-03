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
  Image
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
import { FiTrash } from "react-icons/fi";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { EditUser } from "../../components/editUser";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
}

interface UserDataProps {
  data: UserProps;
  ref: {
    "@ref": {
      id: number;
    };
  };
  ts: number;
}

interface UserProps {
  name: string;
  email: string;
  companyName: string;
  phone: number;
  register_number: string;
  expires_at: string;
  cpf: number;
  driver_category: string;
  
}

interface UserFunctionProps {
  name: string;
  email: string;
  companyName: string;
  phone: number;
  register_number: string;
  expires_at: string;
  cpf: number;
  driver_category: string;
  userId: string;
}


export default function UserList() {
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState(0)
  const [phone, setPhone] = useState(0)
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [userId, setUserId] = useState('')

  const [registerNumber, setRegisterNumber] = useState('')
  const [expires_at, setExpires_at] = useState('')
  const [driver_category, setDriver_category] = useState('')
  


  const [isEditMode, setIsEditMode] = useState(false);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(1);

  const [users, setUsers] = useState<UserDataProps[]>([]);

  const [needsLessHeight, setNeedsLessHeight] = useState('');


  function handleEditUser({
    name,
    email,
    companyName,
    phone,
    register_number,
    expires_at,
    cpf,
    driver_category,
    userId,
  }): UserFunctionProps {
   
    
    setName(name)
    setEmail(email)
    setCpf(cpf)
    setCompanyName(companyName)
    setPhone(phone)
    setRegisterNumber(register_number)
    setExpires_at(expires_at)
    setDriver_category(driver_category)
    setUserId(userId)
      

    setIsEditMode(true);

    return;
  }


  const { data, isLoading, error } = useQuery<UserDataProps[]>(
    `userlist${page}`,
    async () => {
      const response = await api.get(`getallusers?page=${page}&limit=${limit}`);
      const { PaginateData: ReturnedData, totalcount } = response.data;
     
      
     

      setTotal(totalcount);

      return ReturnedData;
    }
  );

  
  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        {isEditMode ? (
          <EditUser 
          userId={userId}
          name={name}
          cpf={cpf}
          email={email}
          phone={phone}
          driver_category={driver_category}
          expires_at={expires_at}
          register_number={registerNumber}
          setIsEditMode={setIsEditMode}
          />
        ) : (
          <Box flex="1" borderRadius={8} bg="gray.800" height="100%" p="8" mt={5}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Users list
            </Heading>

            <Flex
              as="label"
              flex="1"
              py="2"
              px="8"
              ml="6"
              maxWidth={230}
              alignSelf="center"
              color="gray.200"
              position="relative"
              bg="gray.900"
              borderRadius="full"
            >
              <Input
                color="gray.50"
                variant="unstyled"
                px="4"
                mr="4"
                placeholder="Search for a user"
                _placeholder={{ color: "gray.400" }}
              />
              <Icon as={RiSearchLine} fontSize="20" />
            </Flex>
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
                <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["4", "4", "6"]} color="gray.300" width="">
                    <Text>User</Text>
                  </Th>
                  <Th>Company</Th>
                  <Th>CPF</Th>
                  
                  {isWideVersioon && <Th>Driver licence</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((user) => (
                    <Tr 
                    onClick={() => {
                      handleEditUser({
                        companyName: user.data.companyName,
                        cpf: user.data.cpf,
                        name: user.data.name,
                        email: user.data.email,
                        phone: user.data.phone,
                        userId: user.ref["@ref"].id,
                        driver_category: user.data.driver_category,
                        expires_at: user.data.expires_at,
                        register_number: user.data.register_number
                      })
                    }}
                    _hover={{bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer'}}
                    key={user.ts}>
                    <Td px={["4", "4", "6"]}>
                      <Box>
                        <Text fontWeight="bold">{user.data.name}</Text>
                        <Text fontSize="sm" color="gray.300">
                        {user.data.email}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{user.data.companyName}</Td>
                    {isWideVersioon && <Td>{user.data.cpf}</Td>}
                    <Td>

                      {!user.data.register_number || user.data.register_number == '' ? (
                        <Text color={'gray.300'}>Not registered</Text>
                      ) : (
                        <Box>
                        <Text fontWeight="bold">{`${user.data.register_number} / ${user.data.driver_category}`}</Text>
                        <Text fontSize="sm" color="gray.300">
                          {dayjs(user.data.expires_at).format('DD/MM/YYYY') > dayjs().format('DD/MM/YYYY') ? (
                            <Text color={'red.400'}>Expired</Text>
                          ) : (
                            <Text color={'blue.500'}>{`Expires at: ${dayjs(user.data.expires_at).format('DD/MM/YYYY')}`}</Text>
                            
                            
                          )}
                          
                        </Text>
                      </Box>
                      )}

                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              totalCountOfRegisters={total}
              currentPage={page}
              onPageChanges={setPage}
            />
                </>) : (
                  <Flex w="100%" justifyContent="center" cursor={'not-allowed'}>
                  <Box justifyContent="center" mb={8}>
                    <Flex justifyContent={'center'}>
                      <Image opacity={0.4} src='images/noappointments.png' w={'200px'}/>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={24} fontWeight="bold" color={'blackAlpha.400'}>
                        There is not any user registered.
                      </Text>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={18} color={'gray.700'}>
                        Wait someone register in the platform.
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                )
            
          )} 
          
          
        </Box>
        )}
        
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
      return decodedUser.roles.includes(role)
  });


  if(!hasAllRoles){
    return {
      redirect: {
        destination: '/userdashboard',
        permanent: false
      }
    }
  }
  }

  return {
    props: {}
  }
}
