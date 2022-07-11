import {
  Flex,
  Box,
  Avatar,
  Text,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  Link,
  ButtonGroup,
  PopoverFooter,
} from "@chakra-ui/react";
import Router from "next/router";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import { MyPopoverTrigger } from "../PopOverTriggerComponent";

interface ShowProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ShowProfileProps) {
  const { user, isAuthenticated, signOut } = useContext(LoginContext);

  useEffect(() => {
    const waitAuthenticationLoad = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isAuthenticated == false) {
        Router.push("/");
      }
    };
  }, []);

  

  return user ? (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}

      <Popover
      >
        <MyPopoverTrigger>
          <Link>
            <Avatar color="whiteAlpha.900"  size="md" name={user.name} bg="green.600" />
          </Link>
        </MyPopoverTrigger>

        <PopoverContent shadow={'dark-lg'} color='white' bg="#292A36" borderColor='blackAlpha.200' mr={10} mt={2}>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Are you leaving?
        </PopoverHeader>
        
        <PopoverCloseButton />
        
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          
          
            
            <Button w={'100%'} colorScheme='red' onClick={signOut}>
              Leave
            </Button>
          
        </PopoverFooter>
      </PopoverContent>
      </Popover>
    </Flex>
  ) : (
    <Spinner />
  );
}
