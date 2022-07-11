import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { Logo } from './Logo';
import { NotificationsNav } from './NotificationsNav';
import { Profile } from './Profile';
import { SearchBox } from './SearchBox';

export function Header(){

    const { onOpen } = useSidebarDrawer()

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    console.log(isWideVersion)

    return (
       <Flex
        px="6"
        align="center"
        mt="4"
        mx="auto" 
        h="20"
        w="100%" 
        maxW={1600} 
        as="header"
       >

          {!isWideVersion && (
              <IconButton 
              variant="unstyled"
              aria-label='Open navigation'
              icon={<Icon as={RiMenuLine} />}
              fontSize="24"
              onClick={onOpen}
              mr="2"
              alignItems="center"
              >

              </IconButton>
          )}  

          <Logo />

            {isWideVersion && <SearchBox />}

            <Flex
            align="center"
            ml="auto"
            >
                <NotificationsNav />

                <Profile showProfileData={isWideVersion}/>
                
            </Flex>
       </Flex>
    );
}