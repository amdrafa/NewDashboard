import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  useToast,
  Select,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../services/axios";
import { decode } from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Footer } from "../../components/footer";
import { ChooseVehicle } from "../../components/ChooseVehicle";
import { RiCarLine } from "react-icons/ri";
import { BiBuilding } from "react-icons/bi";
import { FiTool } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/router";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  name: string;
};

interface resourceProps {
  name: string;
  capacity: number;
}

const createResourceFormSchema = yup.object().shape({
  name: yup.string().required(),
  capacity: yup.number().required(),
});

export default function CreateResource() {
  const toast = useToast();

  const router = useRouter()

  const [selectedType, setSelectedType] = useState('Test track')

  const [isResorceActive, setIsResourceActive] = useState(true)

  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(createResourceFormSchema),
  });

  const { errors } = formState;

  const handleCreateResource: SubmitHandler<resourceProps> = async ({
    name,
    capacity
  }) => {
    await api
      .post("/resource/create", {
        name,
        capacity,
        isActive: isResorceActive,
        type: selectedType
      })
      .then((response) => {
        toast({
          title: "Resource created",
          description: `Resource was created successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

       router.push('/resources')
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Error when adding resource.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

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
          onSubmit={handleSubmit(handleCreateResource)}
        >
          <Heading size="lg" fontWeight="normal">
            Add a resource
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="name"
                label="Name"
                {...register("name")}
                error={errors.resource}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Box align={'center'} w='100%' justify={'center'}>
                <HStack  w='100%' mt={'0.5rem'} spacing='1.5rem'>
                  <ChooseVehicle
                    isActive={selectedType === 'Test track'}
                    vehicleType="Test track"
                    icon={RiCarLine}
                    onClick={() => setSelectedType('Test track')}
                  />
                  <ChooseVehicle
                    isActive={selectedType === 'Office'}
                    vehicleType="Office"
                    icon={BiBuilding}
                    onClick={() => setSelectedType('Office')}
                  />
                  <ChooseVehicle
                    isActive={selectedType === 'Workshop'}
                    vehicleType="Workshop"
                    icon={FiTool}
                    onClick={() => setSelectedType('Workshop')}
                  />
                </HStack>
                <Flex mt={'1.5rem'}>
                  <Checkbox defaultChecked={isResorceActive} checked={isResorceActive} onChange={e => setIsResourceActive(e.target.checked)} />
                  <Text color={'gray.200'} ml={'0.5rem'}>Resource active</Text>
                </Flex>
              </Box>
              <Box>
                <Input
                  type="number"
                  name="capacity"
                  label="Capacity"
                  {...register("capacity")}
                  error={errors.capacity}
                  mb='0.5rem'
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
                type="submit"
                colorScheme="blue"
              >
                Save
              </Button>
            </HStack>
          </Flex>
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

//     const {auth} = parseCookies(ctx)

//     const decodedUser = decode(auth as string) as DecodedToken;

//     const necessaryRoles = ['ADMINISTRATOR']

//     if(necessaryRoles?.length > 0){
//       const hasAllRoles = necessaryRoles.some(role => {
//         return decodedUser?.roles?.includes(role)
//     });

//     if(!hasAllRoles){
//       console.log(hasAllRoles)
//       return {
//         redirect: {
//           destination: '/home',
//           permanent: false
//         }
//       }
//     }
//     }

//     return {
//       props: {}
//     }
//   }
