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
} from "@chakra-ui/react";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
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

interface UserProps {
  id: number;
  name: string;
  email: string;
  document: string;
  companyId?: number;
  isForeigner: boolean;
}

interface UserFunctionProps {
  id: number;
  name: string;
  email: string;
  document: string;
  companyId?: number;
  isForeigner: boolean;
}

export default function UserList() {
  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const router = useRouter()

  const [filteredData, setFilteredData] = useState<UserProps[]>([]);

  const [userId, setUserId] = useState(0);


  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(6);

  const [total, setTotal] = useState(1);

  const [searchUsersValue, setSearchUsersValue] = useState("");

  function handleEditUser({
  
    id,

  }: UserProps) {
  
    setUserId(id);
    
    router.push(`/users/detail/${id}`)

    return;
  }

  const { data, isLoading, error, refetch } = useQuery<UserProps[]>(
    `userlist${page}`,
    async () => {
      const response = await api.get(`/user/list?page=${page}&limit=${limit}`);

      setTotal(20);

      setFilteredData(response.data)

      return response.data;
    }
  );


  function handleSearchUsers(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchUsersValue(event.target.value);

    if (event.target.value == "") {
      setSearchUsersValue("");

      return;
    }

    setFilteredData(
      data.filter((user) => {
        return user.name
          .toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || user.document
          .toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || user.email
          .toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || user.id
          .toString()
          .includes(searchUsersValue.toLowerCase())
      })
    );
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
                  onChange={handleSearchUsers}
                />
                <Icon as={RiSearchLine} fontSize="20" />
              </Flex>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner mt="70px" mb="110px" />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>The requisition failed</Text>
              </Flex>
            ) : data?.length > 0 ? (
              <>
                <Flex
                  minHeight={"400px"}
                  flexDir={"column"}
                  justifyContent="space-between"
                >
                   <Flex
                height={"100%"}
                maxHeight={"24rem"}
                flexDir={"column"}
                mt={"1.2rem"}
                w={"100%"}
                overflowY={"scroll"}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "blackAlpha.500",
                    borderRadius: "24px",
                  },
                }}
              >
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="">
                          <Text>Id</Text>
                        </Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Document</Th>
                        <Th>Company</Th>
                        <Th>Foreigner</Th>
                      </Tr>
                    </Thead>
                    {searchUsersValue.length > 1 ? (
                      <Tbody>
                      {filteredData.map((user) => (
                        <Tr
                          onClick={() => {
                            handleEditUser({
                              id: user.id,
                              document: user.document,
                              email: user.email,
                              isForeigner: user.isForeigner,
                              name: user.name,
                              companyId: user.companyId,
                            });
                          }}
                          _hover={{
                            bg: "gray.900",
                            color: "gray.300",
                            transition: "0.2s",
                            cursor: "pointer",
                          }}
                          key={user.id}
                        >
                          <Td px={["4", "4", "6"]}>
                            <Text fontWeight="bold">{user.id}</Text>
                          </Td>

                          {isWideVersioon && <Td>{user.name}</Td>}

                          <Td>
                            <Text color={"gray.300"}>{user.email}</Text>
                          </Td>
                          <Td>
                            <Text color={"gray.300"}>{user.document}</Text>
                          </Td>
                          <Td>
                            <Text color={"gray.300"}>{user.companyId ? user.companyId : "Not registered"}</Text>
                          </Td>
                          <Td>
                            <Text color={"gray.300"}>{user.isForeigner ? "Yes" : "No"}</Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    ) : (
                      <Tbody>
                        {data.map((user) => (
                          <Tr
                            onClick={() => {
                              handleEditUser({
                                id: user.id,
                                document: user.document,
                                email: user.email,
                                isForeigner: user.isForeigner,
                                name: user.name,
                                companyId: user.companyId,
                              });
                            }}
                            _hover={{
                              bg: "gray.900",
                              color: "gray.300",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                            key={user.id}
                          >
                            <Td px={["4", "4", "6"]}>
                              <Text fontWeight="bold">{user.id}</Text>
                            </Td>

                            {isWideVersioon && <Td>{user.name}</Td>}

                            <Td>
                              <Text color={"gray.300"}>{user.email}</Text>
                            </Td>
                            <Td>
                              <Text color={"gray.300"}>{user.document}</Text>
                            </Td>
                            <Td>
                              <Text color={"gray.300"}>{user.companyId ? user.companyId : "Not registered"}</Text>
                            </Td>
                            <Td>
                              <Text color={"gray.300"}>{user.isForeigner ? "Yes" : "No"}</Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    )}
                  </Table>
                  {/* {searchUsersValue.length > 0 ? (
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
                  )} */}
                </Flex>
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
