import {
  Flex,
  Text,
  Input,
  Icon,
  Box,
  HStack,
  Link,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BsFillCircleFill,
  BsExclamationCircle,
  BsCheckCircle,
} from "react-icons/bs";
import { RiNotificationLine, RiSearchLine } from "react-icons/ri";
import { useQuery } from "react-query";
import { api } from "../../services/axios";
import { MyPopoverTrigger } from "../PopOverTriggerComponent";

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

export function SearchBox() {
  const [filteredData, setFilteredData] = useState<speedwayDataProps[]>([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [total, setTotal] = useState(1);

  const { data, isLoading, error } = useQuery<speedwayDataProps[]>(
    `speedwaysearchbox${page}`,
    async () => {
      const response = await api.get(
        `getallspeedways?page=${page}&limit=${limit}`
      );
      const { PaginateData: ReturnedData, totalcount } = response.data;

      setTotal(totalcount);

      return ReturnedData;
    }
  );

  const [searchTestTrackValue, setSearchTestTrackValue] = useState("");

  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setSearchTestTrackValue(event.target.value);

    if (event.target.value == "") {
        setSearchTestTrackValue("");
        setSearchTestTrackValue("");
    }

    setFilteredData(
      data.filter((item) => {
        return item.data.speedway
          .toLowerCase()
          .trim()
          .includes(searchTestTrackValue.toLowerCase().trim());
      })
    );
  }

  useEffect(() => {
    setSearchTestTrackValue('')
  }, [data])

  return (
    <>
      <HStack
        spacing="8"
        mx={["6", "8"]}
        pr={["6", "8"]}
        py="1"
        color="gray.300"
      >
        <Popover autoFocus={false} placement={"bottom-end"}>
          <MyPopoverTrigger>
            <Flex
              as="label"
              flex="1"
              py="3"
              px="8"
              ml="6"
              maxWidth={400}
              alignSelf="center"
              color="gray.200"
              position="relative"
              bg="gray.800"
              borderRadius="full"
            >
              <Input
                color="gray.50"
                variant="unstyled"
                px="4"
                mr="4"
                placeholder="Search for a test track"
                _placeholder={{ color: "gray.400" }}
                onChange={handleSearchInput}
              />
              <Icon as={RiSearchLine} fontSize="20" />
            </Flex>
          </MyPopoverTrigger>

          {searchTestTrackValue.length > 0 && filteredData.length > 0 ? (
            <PopoverContent
              color="white"
              bg="#292A36"
              borderColor="blackAlpha.200"
              shadow={"2xl"}
              mt={2}
              ml={8}
            >
              {/* <PopoverHeader pt={4} fontWeight="bold" border="0">
              <Text>Notifications</Text>
            </PopoverHeader> */}

              {filteredData.map((testtrack) => {
                return (
                  <Box key={testtrack.ts}>
                    
                      <Flex
                        borderTop={"1px"}
                        borderColor="gray.700"
                        alignItems={"center"}
                        pr={2}
                        pl={4}
                        py={2}
                        cursor={"pointer"}
                        _hover={{ bg: "#21222c" }}
                      >
                        <Box>
                          <Text
                            fontWeight={600}
                            fontSize={16}
                            color={"blue.500"}
                          >
                            {testtrack.data.speedway}
                          </Text>
                          <Box>
                            <Text pr={1.5} fontSize={14} color={"gray.300"}>
                              Responsable: {testtrack.data.description}
                            </Text>
                            
                          </Box>
                        </Box>
                      </Flex>
                    
                  </Box>
                );
              })}

              <PopoverCloseButton />
            </PopoverContent>
          ) : (
            ""
          )}
        </Popover>
      </HStack>
    </>
  );
}
