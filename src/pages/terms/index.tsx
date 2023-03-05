import {
    Box,
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
    Image,
    Button,
    Link,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { RiAddLine, RiSearchLine } from "react-icons/ri";
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
  import { Footer } from "../../components/footer";
  import { useRouter } from "next/router";
  
  export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    permissions: string[];
    name: string;
  };
  
  interface TermsProps {
    id: number;
    title: string;
    text: string;
    createdAt: string;
  }
  
  
  export default function TermsList() {
    const isWideVersioon = useBreakpointValue({
      base: false,
      lg: true,
    });
  
    const router = useRouter()
  
    const [filteredData, setFilteredData] = useState([]);
  
    const [termId, setTermId] = useState(0);
  
  
    const [page, setPage] = useState(1);
  
    const [limit, setLimit] = useState(6);
  
    const [total, setTotal] = useState(1);
  
    const [searchUsersValue, setSearchUsersValue] = useState("");
  
    function handleEditTerm({
      id
    }: TermsProps) {
    
      setTermId(id);
      
      router.push(`/terms/detail/${id}`)
  
      return;
    }
  
    const { data, isLoading, error, refetch } = useQuery<TermsProps[]>(
      `terms${page}`,
      async () => {
        const response = await api.get(`/terms/list?page=${page}&limit=${limit}`);
  
        setTotal(20);
  
        return response.data;
      }
    );
  
  
    function handleSearchUsers(event: React.ChangeEvent<HTMLInputElement>) {
      setSearchUsersValue(event.target.value);
  
      if (event.target.value == "") {
        setSearchUsersValue("");
  
        return;
      }
  
      // setFilteredData(
      //   data.filter((user) => {
      //     return user.data.name
      //       .toLowerCase()
      //       .includes(searchUsersValue.toLowerCase());
      //   })
      // );
    }
  
    return (
      <Box mt={-3}>
        <Header />
  
        <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
          <Sidebar />
  
          
            <Box
              flex="1"
              borderRadius={8}
              bg="gray.800"
              height="100%"
              p="8"
              mt={5}
            >
              <Flex mb="8" justify="space-between" align="center">
                <Heading size="lg" fontWeight="normal">
                  Terms list
                </Heading>
  
                <Link href="/terms/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Add a new term
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
              ) : total > 0 ? (
                <>
                  <Flex
                    minHeight={"400px"}
                    flexDir={"column"}
                    justifyContent="space-between"
                  >
                    <Table colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th px={["4", "4", "6"]} color="gray.300" width="">
                            <Text>Id</Text>
                          </Th>
                          <Th>Title</Th>
                          <Th>Description</Th>
                          <Th>Created at</Th>
                        </Tr>
                      </Thead>
                      
                        <Tbody>
                          {data.map((term) => (
                            <Tr
                              onClick={() => {
                                handleEditTerm({
                                    id: term.id,
                                    createdAt: term.createdAt,
                                    text: term.text,
                                    title: term.title
                                });
                              }}
                              _hover={{
                                bg: "gray.900",
                                color: "gray.300",
                                transition: "0.2s",
                                cursor: "pointer",
                              }}
                              key={term.id}
                            >
                              <Td px={["4", "4", "6"]}>
                                <Text fontWeight="bold">{term.id}</Text>
                              </Td>
  
                              {isWideVersioon && <Td>{term.title}</Td>}
  
                              <Td>
                                <Text color={"gray.300"}>{term.text.length > 44 ? term.text.substring(0, 45) + ' [...]' : term.text}</Text>
                              </Td>
                              <Td>
                                <Text color={"gray.300"}>{dayjs(term.createdAt).format('dddd, MMMM D, YYYY h:mm A')}</Text>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                    </Table>
                    {searchUsersValue.length > 0 ? (
                      <Pagination
                        totalCountOfRegisters={filteredData.length}
                        currentPage={page}
                        onPageChanges={setPage}
                      />
                    ) : (
                      <Pagination
                        totalCountOfRegisters={total}
                        currentPage={page}
                        onPageChanges={setPage}
                      />
                    )}
                  </Flex>
                </>
              ) : (
                <Flex
                  w="100%"
                  alignItems={"center"}
                  justifyContent="center"
                  minH={"400px"}
                  cursor={"not-allowed"}
                >
                  <Box justifyContent="center" mb={8}>
                    <Flex justifyContent={"center"}>
                      <Image
                        opacity={0.4}
                        src="images/noappointments.png"
                        w={"200px"}
                      />
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text
                        fontSize={24}
                        fontWeight="bold"
                        color={"blackAlpha.400"}
                      >
                        There is not any user registered.
                      </Text>
                    </Flex>
                    <Flex w="100%" justifyContent="center">
                      <Text
                        fontSize={18}
                        color={"blackAlpha.400"}
                        fontWeight="semibold"
                      >
                        Wait someone register in the platform.
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )}
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
  //   const { auth } = parseCookies(ctx);
  
  //   const decodedUser = decode(auth as string) as DecodedToken;
  
  //   const necessaryRoles = ["ADMINISTRATOR"];
  
  //   if (necessaryRoles?.length > 0) {
  //     const hasAllRoles = necessaryRoles.some((role) => {
  //       return decodedUser?.roles?.includes(role);
  //     });
  
  //     if (!hasAllRoles) {
  //       return {
  //         redirect: {
  //           destination: "/home",
  //           permanent: false,
  //         },
  //       };
  //     }
  //   }
  
  //   return {
  //     props: {},
  //   };
  // };
  