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
  HStack,
  useToast,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import Modal from "react-modal";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { HiOutlineCursorClick } from "react-icons/hi";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import { Footer } from "../../components/footer";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { AiOutlineCloudUpload } from "react-icons/ai";

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

export default function UserCertificates() {
  const router = useRouter();

  const toast = useToast();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState<File>(null);

  function handleCloseUploadModal() {
    setIsUploadModalOpen(false);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event?.target?.files?.[0]);
  };

  async function handleUploadCertificate(){
    
    console.log(selectedFiles)
    console.log(selectedCertificate)

    const data = new FormData()

    data.append("certificate", selectedFiles)

    console.log(data)

    await api.post(`/user/6/approve/${selectedCertificate}`, data)
    .then(response => {
        toast({
            title: "deu bom"
        })
    })
    .catch(e => {
        toast({
            title: "deu ruimmmm"
        })
    })

  }

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
                      <Th px={["4", "4", "6"]} width="">
                        <Text>Action</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Name</Text>
                      </Th>

                      <Th>Type</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map((certificate) => (
                      <Tr
                        key={certificate.id}
                        _hover={{
                          color: "gray.200",
                          cursor: "pointer",
                          bg: "gray.900",
                          transition: "0.2s",
                        }}
                      >
                        {certificate.certificateType == "Script" ? (
                          <Td
                            onClick={() => {
                              toast({
                                title: "Waiting backend update",
                                description: `Team is still deciding its functionality.`,
                                status: "info",
                                duration: 5000,
                                isClosable: true,
                                position: "top-right",
                              });
                            }}
                          >
                            <HStack
                              color={"blue.500"}
                              _hover={{ color: "blue.800" }}
                            >
                              <Icon
                                fontSize={"1.3rem"}
                                as={HiOutlineCursorClick}
                              />
                              <Text>Iniciar curso</Text>
                            </HStack>
                          </Td>
                        ) : certificate.certificateType == "Upload" ? (
                          <Td onClick={() => {
                            setSelectedCertificate(certificate.id)
                            setIsUploadModalOpen(true)
                          }}>
                            <HStack
                              color={"blue.500"}
                              _hover={{ color: "blue.800" }}
                            >
                              <Icon
                                fontSize={"1.3rem"}
                                as={AiOutlineCloudUpload}
                              />
                              <Text>Upload certificate</Text>
                            </HStack>
                          </Td>
                        ) : (
                          <Td>
                            <Text color={"gray.600"}>Waiting for approval</Text>
                          </Td>
                        )}

                        <Td>{certificate.certificateName}</Td>

                        <Td>{certificate.certificateType}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {/* <Pagination
                    totalCountOfRegisters={total}
                    currentPage={page}
                    onPageChanges={setPage}
                  /> */}
              </Flex>
              <Flex w={"100%"} justify="end">
                <Link href="/home">
                  <Button colorScheme="whiteAlpha">Cancel</Button>
                </Link>
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

      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={handleCloseUploadModal}
        overlayClassName="react-modal-overlay"
        className="react-modal-content-slots-confirmation"
        ariaHideApp={false}
      >
        <Flex justifyContent="flex-start">
          <Text fontSize={24} fontWeight="bold" color={"gray.100"}>
            <Text as={"span"} color={"blue.500"}>
              Upload
            </Text>{" "}
            certificate
          </Text>
        </Flex>
        <Text>Be sure the certification you are uploading is legally valid.</Text>
        <>

          <Flex w={'100%'} justify='start' my={'2rem'} >
            <Input onChange={handleFileSelect} variant='unstyled' border={'none'} borderColor={'gray.800'} w={'50%'} type={'file'} colorScheme='blue'/>
          </Flex>

          <HStack spacing={4} justify="end">
            <Button onClick={handleCloseUploadModal} colorScheme="whiteAlpha">
              Cancel
            </Button>

            <Button colorScheme="blue" onClick={handleUploadCertificate}>Upload</Button>
          </HStack>
        </>
      </Modal>
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
