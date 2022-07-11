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
  } from "@chakra-ui/react";
  import Link from "next/link";
  import {useState, useEffect } from "react";
  import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
  import { FiTrash } from "react-icons/fi";
  import { Header } from "../../components/Header";
  import { Pagination } from "../../components/Pagination";
  import { Sidebar } from "../../components/Sidebar";
  import { api } from "../../services/axios";
  import { useQuery } from "react-query";

  
  interface AdmDataProps {
    data: AdmProps;
    ref: string;
    ts: number;
  }
  
  interface AdmProps {
    name: string;
    email: string;
    companyRef: {
        id: number;
    }
  }
  
  export default function AdmList() {
    const isWideVersioon = useBreakpointValue({
      base: false,
      lg: true,
    });
  
    const [page, setPage] = useState(1);
  
    const [limit, setLimit] = useState(6);
  
    const [total, setTotal] = useState(1);
  
    const [users, setUsers] = useState<AdmDataProps[]>([]);


  
    const { data, isLoading, error } = useQuery<AdmDataProps[]>(
      `admlist${page}`,
      async () => {
        const response = await api.get(`getalladms?page=${page}&limit=${limit}`);
        const { PaginateData: ReturnedData, totalcount } = response.data;
        console.log(ReturnedData);
        
        setTotal(totalcount)
      
  
        setTotal(totalcount);
  
        return ReturnedData;
      }
    );
  
    
  
    return (
      <Box mt={-3}>
        <Header />
  
        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
  
          <Box flex="1" borderRadius={8} bg="gray.800" height={'100%'} p="8" mt={5}>
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Administrators list
              </Heading>
  
              <Link href="/administrators/create" passHref>
              <Button
                as="a"
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
                <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={["4", "4", "6"]} color="gray.300" width="">
                    <Text>Administrator</Text>
                  </Th>
                  <Th>Created by</Th>
                  {isWideVersioon && <Th>Register date</Th>}
                  <Th w="8"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((adm) => (
                    <Tr key={adm.ts}>
                    <Td px={["4", "4", "6"]}>
                      <Box>
                        <Text fontWeight="bold">{adm.data.name}</Text>
                        <Text fontSize="sm" color="gray.300">
                        {adm.data.email}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      <Text>{adm.ts}</Text>
                    </Td>
                    {isWideVersioon && <Td>18 de maio, 2022</Td>}
                    <Td display="flex" justifyContent="right" mt="2">
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="gray"
                        color="gray.900"
                        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                      >
                        Edit
                      </Button>
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
                </>) : (<Flex w="100%" mt={"110px"} justifyContent="center"> 
                <Box justifyContent="center">
                    <Flex w="100%" justifyContent="center">
                        <Text fontSize={22} fontWeight="bold">There is not any administrator registered.</Text>         
                    </Flex>
                    <Flex w="100%" justifyContent="center">           
                <Text fontSize={18}>Create a new administrator and a passsword will be sent to his e-mail.</Text>
                </Flex> 
                </Box>
              </Flex>)
              
            )} 
            
            
          </Box>
        </Flex>
      </Box>
    );
  }
  