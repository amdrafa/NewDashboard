import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Input } from "../../../components/Form/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../services/axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

interface scheduleProps {
  id: string;
  startDate: Date;
  finalDate: Date;
  isExclusive: boolean;
  status: string;
}

interface bookingProps {
  id: number;
  schedules: scheduleProps[];
}

export default function EditBooking() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { data, isLoading, error } = useQuery<bookingProps>(
    `/booking/${id}/schedule`,
    async () => {
      const response = await api.get(`/booking/${id}/schedule`);
      const data = response.data;

      return data;
    },
    {
      enabled: !!id,
    }
  );

  return (
    <Box mt={-3}>
      <Header />
      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />
        <Box
          as="form"
          flex="1"
          height={"100%"}
          borderRadius={8}
          bg="gray.800"
          p="8"
          mt={5}
        >
          <Flex justify={"space-between"} alignItems="center">
            <Heading
              justifyContent={"space-between"}
              size="lg"
              fontWeight="normal"
            >
              Edit booking
            </Heading>
          </Flex>

          <Divider my="6" borderColor="gray.700" />

          <Flex
            height={"100%"}
            maxHeight={"26rem"}
            flexDir={"column"}
            mt={"1.2rem"}
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
                    <Text>Resource</Text>
                  </Th>
                  <Th px={["4", "4", "6"]} width="">
                    <Text>From</Text>
                  </Th>

                  <Th>To</Th>

                  <Th>Exclusive</Th>

                  <Th>Status</Th>

                  <Th></Th>

                </Tr>
              </Thead>

              <Tbody>
                {data?.schedules?.map((schedule) => {
                  return (
                    <Tr key={schedule.id}>
                      <Td>{schedule.id}</Td>
                      <Td>VDA - Fix</Td>
                      <Td>{dayjs(schedule.startDate).format('dddd, MMMM D, YYYY h:mm A')}</Td>
                      <Td>{dayjs(schedule.finalDate).format('dddd, MMMM D, YYYY h:mm A')}</Td>
                      
                      <Td>
                        <Text
                          ml={"1.5rem"}
                          color={schedule.isExclusive ? "blue.500" : 'gray.400'}
                          fontWeight="bold"
                        >
                          <IoDiamondOutline fontSize={"1.2rem"} />
                        </Text>
                      </Td>

                      <Td>{schedule.status}</Td>
                      <Td>
                        <Flex
                          color={"gray.500"}
                          fontWeight="semibold"
                          _hover={{ color: "red.500", cursor: "pointer" }}
                        >
                          <BiTrash size={"1.2rem"} />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
