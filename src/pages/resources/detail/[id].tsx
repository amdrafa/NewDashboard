import {
  Flex,
  Button,
  Icon,
  Divider,
  Text,
  VStack,
  SimpleGrid,
  Box,
  Heading,
  HStack,
  useToast,
  Checkbox,
  Select,
  Link,
} from "@chakra-ui/react";
import { Input } from "../../../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../services/axios";
import { useContext, useState } from "react";
import { LoginContext } from "../../../contexts/LoginContext";
import { FiTool, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { MdDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BiBuilding } from "react-icons/bi";
import { RiCarLine } from "react-icons/ri";
import { ChooseVehicle } from "../../../components/ChooseVehicle";

interface resourceProps {
  id?: number;
  name: string;
  type: string;
  capacity: number;
  isActive?: false;
  createdAt?: string;
}

const EditResourceFormSchema = yup.object().shape({
  company: yup.string().required(),
  cnpj: yup.number().required(),
});

export default function EditResource() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [selectedType, setSelectedType] = useState("default");

  const [isResorceActive, setIsResourceActive] = useState(true);

  const [name, setName] = useState("");

  const [capacity, setCapacity] = useState("");

  const {
    data: resourceData,
    isLoading: isResourceLoading,
    error: errorResource,
  } = useQuery<resourceProps>(
    `resource${id}`,
    async () => {
      const response = await api.get(`/resource/list/${id}`);
      console.log(response.data);
      setSelectedType(response.data.type);
      setName(response.data.name);
      setCapacity(response.data.capacity);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditResourceFormSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleEditResource = async () => {
    await api
      .put("/resource/update", {
        id,
        name,
        capacity: Number(capacity),
        isActive: isResorceActive,
        type: selectedType,
      })
      .then((response) => {
        toast({
          title: "Resource updated",
          description: `Resource updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        router.push("/resources");
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Error when editing resource.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  async function deleteResource() {
    await api
      .delete(`/resource/delete/${id}`)
      .then((response) => {
        toast({
          title: "Resource deleted",
          description: `${resourceData?.name} was deleted successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        router.push("/resources");
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Something went wrong when deleting ${resourceData?.name}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }

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
          <Flex justify={'space-between'} align='center'>
            <Heading size="lg" fontWeight="normal">
              Edit resource
            </Heading>

            <Button
              color={"gray.400"}
              onClick={deleteResource}
              bg="gray.900"
              _hover={{ bg: "red.500", color: "white" }}
            >
              <Icon mr={1.5} as={FiTrash2} />
              Delete resource
            </Button>
          </Flex>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                defaultValue={resourceData?.name}
                name="name"
                label="Name"
                {...register("name")}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Box align={"center"} w="100%" justify={"center"}>
                <HStack w="100%" mt={"0.5rem"} spacing="1.5rem">
                  <ChooseVehicle
                    isActive={selectedType === "Test track"}
                    vehicleType="Test track"
                    icon={RiCarLine}
                    onClick={() => setSelectedType("Test track")}
                  />
                  <ChooseVehicle
                    isActive={selectedType === "Office"}
                    vehicleType="Office"
                    icon={BiBuilding}
                    onClick={() => setSelectedType("Office")}
                  />
                  <ChooseVehicle
                    isActive={selectedType === "Workshop"}
                    vehicleType="Workshop"
                    icon={FiTool}
                    onClick={() => setSelectedType("Workshop")}
                  />
                </HStack>
                <Flex mt={"1.5rem"}>
                  <Checkbox
                    defaultChecked={isResorceActive}
                    checked={isResorceActive}
                    onChange={(e) => setIsResourceActive(e.target.checked)}
                  />
                  <Text color={"gray.200"} ml={"0.5rem"}>
                    Resource active
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Input
                  defaultValue={resourceData?.capacity}
                  type="number"
                  name="capacity"
                  label="Capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                  error={errors.capacity}
                  mb="0.5rem"
                />
              </Box>
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/resources" passHref>
                <Button as={"a"} colorScheme="whiteAlpha">
                  Cancel
                </Button>
              </Link>
              <Button
                isLoading={formState.isSubmitting}
                colorScheme="blue"
                onClick={() => handleEditResource()}
              >
                Save
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
