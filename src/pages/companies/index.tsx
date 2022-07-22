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
  Spinner,
} from "@chakra-ui/react";
import { query as q } from "faunadb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { fauna } from "../../services/fauna";
import { useQuery } from "react-query";
import ReactPaginate from 'react-paginate'
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import EditCompany from "../../components/editCompany";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  name: string;
}

interface companyDataProps {
  data: companyProps;
  ref: {
    "@ref": {
      id: number;
    };
  };
  ts: number;
}

interface companyProps {
  company: string;
  cnpj: string;
  responsable_name: string;
  email: string;
  phone: number;
  avaiableHours: number;
  companyId: string;
  createdAt?: string;
}


export default function CompanyList() {

  const [companyId, setCompanyId] = useState("");
  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('false');
  const [responsable_name, setResponsable_name] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(0);
  const [avaiableHours, setAvaiableHours] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);

  function handleEditCompany({
    company,
    cnpj,
    responsable_name,
    email,
    phone,
    avaiableHours,
    companyId

  }): companyProps {
   
    
    setCompany(company)
    setCnpj(cnpj)
    setResponsable_name(responsable_name)
    setEmail(email)
    setPhone(phone)
    setAvaiableHours(avaiableHours)
    setCompanyId(companyId)
    

    setIsEditMode(true);

    return;
  }
    
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(1);

  

  const { data, isLoading, error } = useQuery<companyDataProps[]>(`companylist${page}`, async () => {
    const response = await api.get(`getallcompanies?page=${page}&limit=${limit}`)
    const {PaginateData: ReturnedData, totalcount} = response.data;

    setTotal(totalcount)
    
    return ReturnedData;
  });


  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600}  mx="auto" px="6">
        <Sidebar />

        {isEditMode ? (
          <EditCompany
          company={company}
          cnpj={cnpj}
          responsable_name={responsable_name}
          phone={phone}
          hours={avaiableHours}
          email={email}
          companyId={companyId}
          setIsEditMode={setIsEditMode}
          />
        ) : (
          <Box flex="1" borderRadius={8} bg="gray.800" height='100%'  p="8" mt={5}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Company list
            </Heading>

            <Link href="/companies/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="blue"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Add a new company
              </Button>
            </Link>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner mt="70px" mb="110px" />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>The requisition failed</Text>
            </Flex>
          ) : (
            total > 0 ? (<>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="">
                      <Text>Company</Text>
                    </Th>

                    <Th px={["4", "4", "6"]} width="">
                      <Text>Responsable</Text>
                    </Th>

                    <Th>CNPJ</Th>

                    {isWideVersioon && <Th>Register date</Th>}
                    <Th w="8">Created by</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((company) => (
                    <Tr
                    onClick={() => {
                      handleEditCompany({
                        company: company.data.company,
                        cnpj: company.data.cnpj,
                        responsable_name: company.data.responsable_name,
                        email: company.data.email,
                        phone: company.data.phone,
                        avaiableHours: company.data.avaiableHours,
                        companyId: company.ref["@ref"].id
                      })
                    }}
                    _hover={{bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer'}}
                    key={company.data.cnpj}>
                      <Td px={["4", "4", "6"]}>
                        <Text>{company.data.company}</Text>
                      </Td>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">
                            {company.data.responsable_name}
                          </Text>
                          <Text fontSize="sm" color="gray.300">
                            {company.data.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersioon && <Td>{company.data.cnpj}</Td>}

                      {isWideVersioon && <Td>{company.data.createdAt}</Td>}

                      <Td w={'10rem'}>
                        <Text>
                          Rafael Amaro
                        </Text>
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
                        <Text fontSize={22} fontWeight="bold">There is not any company registered.</Text>         
                    </Flex>
                    <Flex w="100%" justifyContent="center">           
                <Text fontSize={18}>Create a company and an e-mail with a secret key will be sent to the responsable for the institution.</Text>
                </Flex> 
                </Box>
              </Flex>)
          )}
        </Box>
        )}
      </Flex>

      
    </Box>   
  );
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {

  // const {auth} = parseCookies(ctx)

  // const decodedUser = decode(auth as string) as DecodedToken;

  // const necessaryRoles = ['ADMINISTRATOR']
  
  // if(necessaryRoles?.length > 0){
  //   const hasAllRoles = necessaryRoles.some(role => {
  //     return decodedUser.roles.includes(role)
  // });

  // if(!hasAllRoles){
  //   console.log(hasAllRoles)
  //   return {
  //     redirect: {
  //       destination: '/dashboard',
  //       permanent: false
  //     }
  //   }
  // }
  // }

  
  

  return {
    props: {}
  }
}