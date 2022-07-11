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
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/axios";
import { useQuery } from "react-query";
import EditSpeedway from "../../components/editSpeedway";

interface speedwayDataProps {
  data: speedwayProps;
  ref: {
    "@ref": {
      id: number;
    };
  };
  ts: number;
}

interface speedwayProps {
  speedway: string;
  vehicles_limit: number;
  description: string;
  createdAt: string;
  status?: string;
}

export default function Speedwaylist() {
  const [isEditMode, setIsEditMode] = useState(false);

  const [speedway, setSpeedway] = useState("");
  const [speedwayId, setSpeedwayId] = useState("");
  const [vehicles_limit, setVehiclesLimit] = useState(0);
  const [speedway_status, setSpeedway_status] = useState("");
  const [description, setDescription] = useState("");

  function handleEditSpeedway({
    speedway,
    vehicles_limit,
    createdAt,
    description,
    speedwayId,
    status
  }): speedwayProps {
    setSpeedway(speedway);
    setVehiclesLimit(vehicles_limit);
    setDescription(description);
    setSpeedwayId(speedwayId);
    setSpeedway_status(status);

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

  const [needsLessHeight, setNeedsLessHeight] = useState("");

  const { data, isLoading, error } = useQuery<speedwayDataProps[]>(
    `speedwaylist${page}`,
    async () => {
      const response = await api.get(
        `getallspeedways?page=${page}&limit=${limit}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotal(totalcount);

      return ReturnedData;
    }
  );

  console.log(data);

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        {isEditMode ? (
          <EditSpeedway
            speedway={speedway}
            description={description}
            vehicles_limit={vehicles_limit}
            speedwayId={speedwayId}
            speedway_status={speedway_status}
            setIsEditMode={setIsEditMode}
          />
        ) : (
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
                Speedway list
              </Heading>

              <Link href="/speedways/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Add a new speedway
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
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="">
                        <Text>Speedway</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Status</Text>
                      </Th>

                      {isWideVersioon && <Th>Description</Th>}
                      <Th w="8">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((speed) => (
                      <Tr
                        onClick={() => {
                          handleEditSpeedway({
                            speedway: speed.data.speedway,
                            createdAt: speed.data.createdAt,
                            description: speed.data.description,
                            vehicles_limit: speed.data.vehicles_limit,
                            speedwayId: speed.ref["@ref"].id,
                            status: speed.data.status,
                          });
                        }}
                        key={speed.ts}
                        _hover={{ color: "blue.300", cursor: "pointer", bg:'gray.900', transition: '0.2s' }}
                      >
                        <Td px={["4", "4", "6"]}>
                          <Text>{speed.data.speedway}</Text>
                        </Td>
                        <Td>
                          <Box>
                            sadsaddsa
                            <Text fontSize="sm" color="gray.300"></Text>
                          </Box>
                        </Td>
                        {isWideVersioon && <Td>{speed.data.description}</Td>}

                        <Td>
                          {speed.data.status == "active" ? (
                            <Text fontWeight={"medium"} color={"blue.400"}>
                              Active
                            </Text>
                          ) : (
                            <Text fontWeight={"medium"} color={"gray.300"} _hover={{fontWeight:'bold'}}>
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
              </>
            ) : (
              <Flex w="100%" mt={"110px"} justifyContent="center">
                <Box justifyContent="center" mb={"36"}>
                  <Flex w="100%" justifyContent="center">
                    <Text fontSize={22} fontWeight="bold">
                      There is not any speedway registered.
                    </Text>
                  </Flex>
                  <Flex w="100%" justifyContent="center">
                    <Text fontSize={18}>
                      Register a speedway and wait the users to schedule it.
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
