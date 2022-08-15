import { Box, Flex, Icon, Spinner, Stack, Text, Image } from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiContactsLine,
  RiInputMethodLine,
  RiGitMergeLine,
  RiTimeLine,
} from "react-icons/ri";
import { HiOutlineHome } from "react-icons/hi";
import { VscSettingsGear } from "react-icons/vsc";
import { BsSpeedometer2 } from "react-icons/bs";
import { BiBuilding } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { MdOutlineBadge } from "react-icons/md";
import { Can } from "../can";
import { LoginContext } from "../../contexts/LoginContext";
import { useContext, useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import loading from '../../../public/loading.png'

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  permissions: string[];
  name: string;
};

export function SidebarNav() {

  const { user } = useContext(LoginContext);

  let hasSchedulePermission = false;

  const necessaryPermissions = ["SCHEDULE"]

  useEffect(() => {
    const waitAuthenticationLoad = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if(user) {
          hasSchedulePermission = true
      }
    };
  }, [user]);
  

  return (
    (user)? (
      <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
        <NavLink hasPermission={true} hrefs="/home" icon={HiOutlineHome}>
          Home
        </NavLink>

        <Can roles={["ADMINISTRATOR"]}>
          <NavLink
            hasPermission={true}
            hrefs="/approvals"
            icon={AiOutlineAppstoreAdd}
          >
            Approvals
          </NavLink>
        </Can>

        <NavLink
          hasPermission={true}
          hrefs="/userdashboard"
          icon={RiDashboardLine}
        >
          Dashboard
        </NavLink>

        {user ? 
          user.permissions?.some(permission => permission == "SCHEDULE") ? (
            <NavLink hasPermission={true} hrefs="/schedule" icon={RiTimeLine}>
            Schedule 
          </NavLink>
          ) : (
            <Flex cursor={'not-allowed'} alignItems='center'>
              <Icon as={RiTimeLine} fontSize="20" color={'gray.600'}/>
                <Text ml="4" fontWeight="semibold" color={'gray.600'}>Schedule</Text>
            </Flex>
          )
         : (
          'Loading'
        )}

        <Can roles={["ADMINISTRATOR"]}>
          <NavLink hasPermission={true} hrefs="/users" icon={RiContactsLine}>
            Users
          </NavLink>
          <NavLink
            hasPermission={true}
            hrefs="/administrators"
            icon={RiContactsLine}
          >
            Administrators
          </NavLink>
          <NavLink hasPermission={true} hrefs="/companies" icon={BiBuilding}>
            Companies
          </NavLink>
          <NavLink
            hasPermission={true}
            hrefs="/speedways"
            icon={BsSpeedometer2}
          >
            Test tracks
          </NavLink>
          
        </Can>
      </NavSection>

      <NavSection title="CONFIGURATIONS">
        <NavLink hasPermission={true} hrefs="/settings" icon={VscSettingsGear}>
          Settings
        </NavLink>
        <NavLink
          hasPermission={true}
          hrefs="/driverlicence"
          icon={MdOutlineBadge}
        >
          Driver Licence
        </NavLink>
        <Can roles={["ADMINISTRATOR"]}>
        <NavLink
          hasPermission={true}
          hrefs="/reports"
          icon={RiGitMergeLine}
        >
          Reports
        </NavLink>
        </Can>
        <Can roles={["USER"]}>
          <NavLink hasPermission={true} hrefs="/company" icon={BiBuilding}>
            Company
          </NavLink>
        </Can>
      </NavSection>
    </Stack>
    ) : (
      <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>

      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>

      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>

      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>
      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>
      
       
      </NavSection>

      <NavSection title="CONFIGURATIONS">
      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>
      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>
        
      <Image alt="loading" opacity={0.1} w={'110px'} h='20px' src='images/loading.png'/>
        
      </NavSection>
    </Stack>

    )
  );
}
