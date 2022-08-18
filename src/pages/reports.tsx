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
  Image,
  Divider,
  HStack,
  SimpleGrid,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiAddLine, RiPencilLine, RiSearchLine } from "react-icons/ri";
import { Header } from "../components/Header";
import { Pagination } from "../components/Pagination";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/axios";
import { fauna } from "../services/fauna";
import { useQuery } from "react-query";
import ReactPaginate from "react-paginate";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import EditCompany from "../components/editCompany";
import { Footer } from "../components/footer";
import { IoMdClose } from "react-icons/io";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

interface AppointmentProps {
  ref: string;
  ts: number;
  data: {
    selectedSlots: string[];
    speedway: string;
    vehicle: string;
    userId: string;
    status: string;
    companyName: string;
  };
}

interface AppointmentDataProps {
  filteredData: AppointmentProps[];
}

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  name: string;
};

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
  status: string;
  createdAt?: string;
}

export default function Reports() {
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [company, setCompany] = useState("");
  const [cnpj, setCnpj] = useState("false");
  const [responsable_name, setResponsable_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [status, setStatus] = useState("");
  const [avaiableHours, setAvaiableHours] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  function handleGenerateReport({
    company,
    cnpj,
    responsable_name,
    email,
    phone,
    avaiableHours,
    companyId,
    status,
  }): companyProps {
    setCompany(company);
    setCnpj(cnpj);
    setResponsable_name(responsable_name);
    setEmail(email);
    setPhone(phone);
    setAvaiableHours(avaiableHours);
    setCompanyId(companyId);
    setStatus(status);

    setIsModalOpen(true);

    return;
  }

  const handleGenerateReportStep2 = async () => {
    if (selectedYear == "" || selectedMonth == "") {
      toast({
        title: "Select a period",
        description: `You need to choose the report month and year.`,
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }

    const data = await api
      .post<AppointmentDataProps>("generatereport", {
        company,
        companyId,
        selectedMonth,
        selectedYear,
      })
      .then((response) => {
        toast({
          title: "Report generated",
          description: `${company} report download is starting.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setSelectedMonth("");
        setSelectedYear("");
        setIsModalOpen(false);

        const wb = XLSX.utils?.book_new();

        wb.Props = {
          Title: "Report",
          Subject: "Company Report",
          Author: "CTVI Development",
          CreatedDate: new Date(),
        };

        wb.SheetNames.push(`${company}-report`);

        const appointmentsLenght = response.data.filteredData.length;

        const columns = [
          "Company",
          "Vehicle",
          "Test track",
          "User ID",
          "Slots",
          "Total slots",
          "Date",
        ];

        var rows = [];

        const sheetData = [columns];

        let i = 0;

        response.data.filteredData.forEach((item) => {
          rows[i] = [];
          let currentSlots = "";

          rows[i].push(item.data.companyName);
          rows[i].push(item.data.vehicle);
          rows[i].push(item.data.speedway);
          rows[i].push(item.data.userId);
          {
            item.data.selectedSlots.forEach((slot) => {
              currentSlots =
                currentSlots +
                " " +
                dayjs(slot).format("HH:mm") +
                " to " +
                (Number(dayjs(slot).format("HH")) + 1).toString() +
                ":00" +
                ", ";
            });
          }
          rows[i].push(currentSlots);
          rows[i].push(item.data.selectedSlots.length);
          rows[i].push(dayjs(item.data.selectedSlots[0]).format("DD-MM-YYYY"));

          sheetData.push(rows[i]);

          i++;
        });

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        wb.Sheets[`${company}-report`] = ws;

        XLSX.writeFile(
          wb,
          `${company}-report/${dayjs(new Date()).format("MM-YYYY")}.xlsx`,
          { bookType: "xlsx", type: "binary" }
        );
      })
      .catch((err) => {
        toast({
          title: "Appointments not found",
          description: `${company} didn't schedule any appointment in ${dayjs(selectedMonth).format('MMM')}, ${dayjs(selectedYear).format('YYYY')}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const isWideVersioon = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(1);

  const { data, isLoading, error } = useQuery<companyDataProps[]>(
    `companylist${page}`,
    async () => {
      const response = await api.get(
        `getallcompanies?page=${page}&limit=${limit}`
      );
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

        <Box flex="1" borderRadius={8} bg="gray.800" height="100%" p="8" mt={5}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Generate reports
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
                placeholder="Search a company"
                _placeholder={{ color: "gray.400" }}
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
                        <Text>Company</Text>
                      </Th>

                      <Th px={["4", "4", "6"]} width="">
                        <Text>Responsable</Text>
                      </Th>

                      <Th>CNPJ</Th>

                      {isWideVersioon && <Th>Register date</Th>}
                      <Th w="8">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((company) => (
                      <Tr
                        onClick={() => {
                          handleGenerateReport({
                            company: company.data.company,
                            cnpj: company.data.cnpj,
                            responsable_name: company.data.responsable_name,
                            email: company.data.email,
                            phone: company.data.phone,
                            avaiableHours: company.data.avaiableHours,
                            companyId: company.ref["@ref"].id,
                            status: company.data.status,
                          });
                        }}
                        _hover={{
                          bg: "gray.900",
                          color: "gray.300",
                          transition: "0.2s",
                          cursor: "pointer",
                        }}
                        key={company.data.cnpj}
                      >
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

                        <Td w={"10rem"}>
                          {company.data.status == "active" ? (
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
                    There is not any company registered.
                  </Text>
                </Flex>
                <Flex w="100%" justifyContent="center">
                  <Text
                    fontSize={18}
                    color={"blackAlpha.400"}
                    fontWeight="semibold"
                  >
                    Create a company and an e-mail will be sent with its secrety
                    key.
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
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-delete-message"
        ariaHideApp={false}
      >
        <SimpleGrid
          flex="1"
          pb="2"
          gap="1"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            mb={2}
          >
            <Box>
              <Text fontSize={"2xl"}>{company} - Report</Text>
              <Text color={"gray.300"} my={2} fontSize={"md"}>
                An excel file will be generated containing all slots that the
                company used during the month.
              </Text>
            </Box>
            <Icon
              fontSize={20}
              as={IoMdClose}
              onClick={() => {
                setIsModalOpen(false);
              }}
              cursor={"pointer"}
            />
          </Box>
          <Divider orientation="horizontal" />

          <SimpleGrid spacing={4} mt="4" mb={10}>
            <Text w="100%" fontSize="20">
              Select a year:
            </Text>

            <Select
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
              placeholder="Select option"
              color="gray.300"
              bg="gray.900"
              border="none"
              height="45px"
            >
              <option value={"2022-12-17T03:24:00"}>2022</option>
              <option value={"2023-12-17T03:24:00"}>2023</option>
            </Select>

            <Text w="100%" fontSize="20">
              Select a month:
            </Text>

            <Select
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
              placeholder="Select option"
              color="gray.300"
              bg="gray.900"
              border="none"
              height="45px"
            >
              <option value={"2022-01-17T03:24:00"}>January</option>
              <option value={"2022-02-17T03:24:00"}>February</option>
              <option value={"2022-03-17T03:24:00"}>March</option>
              <option value={"2022-04-17T03:24:00"}>April</option>
              <option value={"2022-05-17T03:24:00"}>May</option>
              <option value={"2022-06-17T03:24:00"}>June</option>
              <option value={"2022-07-17T03:24:00"}>July</option>
              <option value={"2022-08-17T03:24:00"}>August</option>
              <option value={"2022-09-17T03:24:00"}>September</option>
              <option value={"2022-10-17T03:24:00"}>October</option>
              <option value={"2022-11-17T03:24:00"}>November</option>
              <option value={"2022-12-17T03:24:00"}>December</option>
            </Select>
          </SimpleGrid>

          <Flex justify={"flex-end"}>
            <HStack spacing={4}>
              <Button
                type="submit"
                onClick={() => setIsModalOpen(false)}
                colorScheme={"whiteAlpha"}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                colorScheme={"blue"}
                onClick={() => {
                  handleGenerateReportStep2();
                }}
              >
                Generate
              </Button>
            </HStack>
          </Flex>
        </SimpleGrid>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { auth } = parseCookies(ctx);

  const decodedUser = decode(auth as string) as DecodedToken;

  const necessaryRoles = ["ADMINISTRATOR"];

  if (necessaryRoles?.length > 0) {
    const hasAllRoles = necessaryRoles.some((role) => {
      return decodedUser?.roles?.includes(role);
    });

    if (!hasAllRoles) {
      console.log(hasAllRoles);
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};
