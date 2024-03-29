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
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import { Footer } from "../../components/footer";
import { useRouter } from "next/router";
import dayjs from "dayjs";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
};

interface certificateProps {
  id: number;
  certificateName: string;
  certificateCode: string;
  certificateType: string;
  createdAt: string;
}

export default function Certificates() {
  const router = useRouter();

  const [certificateId, setCertificateId] = useState(0);

  function handleEditCertificate({ id }): certificateProps {
    setCertificateId(id);

    router.push(`/certificates/detail/${id}`);

    return;
  }

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(1);

  const { data, isLoading, error } = useQuery<certificateProps[]>(
    `certificatelist${page}`,
    async () => {
      const response = await api.get(
        `/certificate/list?page=${page}&limit=${limit}`
      );

      setTotal(10);

      return response.data;
    }
  );

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" height="100%" p="8" mt={5}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Certificates
            </Heading>

            <Link href="/certificates/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="blue"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Add a new certificate
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

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Name</Text>
                      </Th>

                      <Th>Type</Th>

                      <Th>Code</Th>

                      <Th>Created at</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((certificate) => (
                      <Tr
                        onClick={() => {
                          handleEditCertificate({
                            id: certificate.id,
                          });
                        }}
                        key={certificate.id}
                        _hover={{
                          color: "gray.200",
                          cursor: "pointer",
                          bg: "gray.900",
                          transition: "0.2s",
                        }}
                      >
                        <Td px={["4", "4", "6"]}>
                          <Text>{certificate.id}</Text>
                        </Td>

                        <Td>{certificate.certificateName}</Td>

                        <Td>{certificate.certificateType}</Td>

                        <Td>
                          {certificate.certificateCode ? (
                            certificate.certificateCode.length > 35
                                ? certificate.certificateCode.substring(0, 35)
                                : certificate.certificateCode
                          ) : (
                            <Text color={'gray.500'}>
                                Not registered
                            </Text>
                          )}
                        </Td>

                        <Td>
                          {dayjs(certificate.createdAt).format(
                            "MMMM D, YYYY h:mm A"
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
