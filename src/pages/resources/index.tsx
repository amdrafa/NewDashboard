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
  Image,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import EditSpeedway from "../../components/editSpeedway";
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

interface resourceProps {
  id: number;
  name: string;
  type: string;
  capacity: number;
  isActive: false;
  createdAt: string;
}


export default function Resources() {

  const router = useRouter()

  const [ResourceId, setResourceId] = useState(0);

  const [searchUsersValue, setSearchUsersValue] = useState("");

  const [filteredData, setFilteredData] = useState<resourceProps[]>([]);
 

  function handleEditResource({
    id
  }): resourceProps {
    
    setResourceId(id)

    router.push(`/resources/detail/${id}`)

    return;
  }

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(1);


  const { data, isLoading, error } = useQuery<resourceProps[]>(
    `resourcelist${page}`,
    async () => {
      const response = await api.get(
        `/resource/list?page=${page}&limit=${limit}`
      );

      // setTotal(10);
      setFilteredData(response.data)

      return response.data;
    }
  );

  function handleSearchResources(event: React.ChangeEvent<HTMLInputElement>){
    setSearchUsersValue(event.target.value);

    if (event.target.value.length == 1 || event.target.value.length == 0 ) {
      setSearchUsersValue("");
      setFilteredData(data)
      return;
    }

    setFilteredData(
      data?.filter((resource) => {
        return resource.id
          .toString()
          .includes(searchUsersValue.toLowerCase()) || resource.isActive
          .toString().toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || resource.name
          .toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || resource.type
          .toLowerCase()
          .includes(searchUsersValue.toLowerCase()) || resource.capacity
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
                Resources
              </Heading>

              <Link href="/resources/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Add a new resource
                </Button>
              </Link>
            </Flex>

            <Flex
                as="label"
                flex="1"
                py="2"
                px="8"
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
                  onChange={handleSearchResources}
                />
                <Icon as={RiSearchLine} fontSize="20" />
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

                        <Th px={["4", "4", "6"]} width="">
                          <Text>Name</Text>
                        </Th>

                        <Th>Type</Th>

                        <Th>Capacity</Th>

                        <Th>Active</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredData?.map((resource) => (
                        <Tr
                          onClick={() => {
                            handleEditResource({
                              id: resource.id
                            });
                          }}
                          key={resource.id}
                          _hover={{
                            color: "gray.200",
                            cursor: "pointer",
                            bg: "gray.900",
                            transition: "0.2s",
                          }}
                        >
                          <Td px={["4", "4", "6"]}>
                            <Text>{resource.id}</Text>
                          </Td>

                          <Td>{resource.name}</Td>

                          <Td>{resource.type}</Td>

                          <Td>{resource.capacity}</Td>

                          <Td>
                            {resource.isActive ? (
                              <Text fontWeight={"medium"} color={"blue.400"}>
                                Active
                              </Text>
                            ) : (
                              <Text
                                fontWeight={"medium"}
                                color={"gray.300"}
                                _hover={{ fontWeight: "bold" }}
                              >
                                Disabled
                              </Text>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  </Flex>
                  {/* <Pagination
                    totalCountOfRegisters={total}
                    currentPage={page}
                    onPageChanges={setPage}
                  /> */}
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
                      There is not any speedway registered.
                    </Text>
                  </Flex>
                  <Flex w="100%" justifyContent="center">
                    <Text
                      fontSize={18}
                      color={"blackAlpha.400"}
                      fontWeight="semibold"
                    >
                      Create a speedway and wait the users schedule it.
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
