import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Text,
  Spinner,
  Icon,
  Image
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { toast } from "react-toastify";

export default function Home() {
  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6" mb={"14"}>
        <Sidebar />

        <Box flex="1" height={"100%"} borderRadius={8} p="8" mt={5}>
          <Flex>
            <Box w={"60%"}>
              <Text fontSize={"6xl"} color="gray.100" fontWeight="semibold">
                Ready for
              </Text>

              <Text
                mt={-9}
                fontSize={"6xl"}
                color="gray.100"
                fontWeight="semibold"
              >
                Schedule a
              </Text>

              <Text
                mt={-9}
                fontSize={"6xl"}
                color="green.600"
                fontWeight="bold"
              >
                TEST TRACK
              </Text>

              <Box ml={1.5}>
              <Text
                fontSize={"xl"}
                color="gray.200"
                fontWeight="normal"
              >
                Buy some hours and become
              </Text>

              <Text
                fontSize={"xl"}
                color="green.400"
                fontWeight="normal"
                mt={-2}
              >
                Part of the group!
              </Text>
              </Box>
              
              <Link href={'/schedule'}>
              <Button ml={1.5} mt={8} colorScheme={'green'} w={'64'} h='12' rounded={'full'}>
                    SCHEDULE NOW
                </Button>
              </Link>
                
              
            </Box>

            <Box w={"100%"}>
            <Image src="images/about-hero-right1.png"/>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
