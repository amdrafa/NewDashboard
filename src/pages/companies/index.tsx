import {
  Box,
  Button,
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
  Image
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import EditCompany from "../../components/editCompany";
import { Footer } from "../../components/footer";
import dayjs from "dayjs";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  name: string;
}



interface companyProps {
  id: number;
  name: string;
  cnpj: string;
  status: string;
  createdAt?: string;
}


export default function CompanyList() {


  const [companyId, setCompanyId] = useState(0);
  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('false');
  const [status, setStatus] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);

  function handleEditCompany({
    name,
    cnpj,
    status,
    id
  }): companyProps {


    setCompany(name)
    setCnpj(cnpj)
    setCompanyId(id)
    setStatus(status)


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



  const { data, isLoading, error } = useQuery<companyProps[]>(`companylist${page}`, async () => {
    const response = await api.get(`/company/list?page=${page}&limit=${limit}&search=${''}`)
    

    // setTotal(totalcount)

    return response.data;
  });


  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        {isEditMode ? (
          <EditCompany
            cnpj={cnpj}
            company={company}
            id={companyId}
            setIsEditMode={setIsEditMode}
            status={status}
          />
        ) : (
          <Box flex="1" borderRadius={8} bg="gray.800" height='100%' p="8" mt={5}>
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
                <Flex minHeight={'400px'} flexDir={'column'} justifyContent='space-between'>
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="">
                          <Text>Id</Text>
                        </Th>

                        <Th px={["4", "4", "6"]} width="">
                          <Text>Name</Text>
                        </Th>

                        <Th>CNPJ</Th>

                        {isWideVersioon && <Th>Created at</Th>}
                        <Th w="8">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map((company) => (
                        <Tr
                          onClick={() => {
                            handleEditCompany({
                              id: company.id,
                              cnpj: company.cnpj,
                              name: company.name,
                              status: company.status
                            })
                          }}
                          _hover={{ bg: 'gray.900', color: 'gray.300', transition: '0.2s', cursor: 'pointer' }}
                          key={company.cnpj}>
                          <Td px={["4", "4", "6"]}>
                            <Text>{company.id}</Text>
                          </Td>
                          <Td>
                              <Text fontWeight="bold">
                                {company.name}
                              </Text>
                          </Td>
                          <Td>{company.cnpj}</Td>

                          {isWideVersioon && <Td>{dayjs(company.createdAt).format('MMMM D, YYYY h:mm A')}</Td>}

                          <Td w={'10rem'}>

                            {company.status == "Active" ? (
                              <Text fontWeight={"medium"} color={"blue.400"}>
                                Active
                              </Text>
                            ) : (
                              <Text fontWeight={"medium"} color={"gray.300"} _hover={{ fontWeight: 'bold' }}>
                                Disabled
                              </Text>
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
                </Flex>
              </>) : (
                <Flex w="100%" alignItems={'center'} justifyContent="center" minH={'400px'} cursor={'not-allowed'}>
                  <Box justifyContent="center" mb={8}>
                    <Flex justifyContent={'center'}>
                      <Image opacity={0.4} src='images/noappointments.png' w={'200px'} />
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={24} fontWeight="bold" color={'blackAlpha.400'}>
                        There is not any company registered.
                      </Text>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text fontSize={18} color={'blackAlpha.400'} fontWeight='semibold'>
                        Create a company and an e-mail will be sent with its secrety key.
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
        <Flex w={{ lg: '275px' }}></Flex>
        <Footer />
      </Flex>

    </Box>
  );
}



// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const { auth } = parseCookies(ctx)

//   const decodedUser = decode(auth as string) as DecodedToken;

//   const necessaryRoles = ['ADMINISTRATOR']

//   if (necessaryRoles?.length > 0) {
//     const hasAllRoles = necessaryRoles.some(role => {
//       return decodedUser?.roles?.includes(role)
//     });

//     if (!hasAllRoles) {
//       console.log(hasAllRoles)
//       return {
//         redirect: {
//           destination: '/home',
//           permanent: false
//         }
//       }
//     }
//   }


//   return {
//     props: {}
//   }
// }