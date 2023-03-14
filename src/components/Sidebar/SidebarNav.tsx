import { Box, Flex, Icon, Spinner, Stack, Text, Image } from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiContactsLine,
  RiInputMethodLine,
  RiGitMergeLine,
  RiTimeLine,
} from "react-icons/ri";
import { HiOutlineHome, HiOutlineNewspaper } from "react-icons/hi";
import { VscSettingsGear } from "react-icons/vsc";
import { BsSpeedometer2 } from "react-icons/bs";
import { BiBuilding } from "react-icons/bi";
import { GrCertificate } from "react-icons/gr";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { TiDocumentText } from "react-icons/ti";
import { Can } from "../can";
import { LoginContext } from "../../contexts/LoginContext";
import { useContext, useEffect } from "react";

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

  const necessaryPermissions = ["SCHEDULE"];

  useEffect(() => {
    const waitAuthenticationLoad = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (user) {
        hasSchedulePermission = true;
      }
    };
  }, [user]);

  return user ? (
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
          hrefs="/administrator/approval"
          icon={AiOutlineAppstoreAdd}
        >
          Approvals
        </NavLink>


        <NavLink
          hasPermission={true}
          hrefs="/bookings"
          icon={RiDashboardLine}
        >
          Bookings
        </NavLink>

        <NavLink hasPermission={true} hrefs="/schedule" icon={RiTimeLine}>
              Schedule
            </NavLink>

        {/* <Can roles={["ADMINISTRATOR"]}> */}
          <NavLink hasPermission={true} hrefs="/users" icon={RiContactsLine}>
            Users
          </NavLink>

          <NavLink hasPermission={true} hrefs="/companies" icon={BiBuilding}>
            Companies
          </NavLink>
          <NavLink
            hasPermission={true}
            hrefs="/resources"
            icon={BsSpeedometer2}
          >
            Resources
          </NavLink>

          
        {/* </Can> */}
      </NavSection>

      <NavSection title="CONFIGURATIONS">
        <NavLink hasPermission={true} hrefs="/settings" icon={VscSettingsGear}>
          Settings
        </NavLink>

        <NavLink
            hasPermission={true}
            hrefs="/terms"
            icon={HiOutlineNewspaper}
          >
            Terms
          </NavLink>
          
          <NavLink
            hasPermission={true}
            hrefs="/user/certificates"
            color={'white'}
            icon={TiDocumentText}
          >
            User Certificates
          </NavLink>

          <NavLink
            hasPermission={true}
            hrefs="/certificates"
            color={'white'}
            icon={TiDocumentText}
          >
            Certificates
          </NavLink>
        {/* <NavLink
          hasPermission={true}
          hrefs="/driverlicence"
          icon={MdOutlineBadge}
        >
          Driver Licence
        </NavLink> */}
        <Can roles={["ADMINISTRATOR"]}>
          <NavLink hasPermission={true} hrefs="/reports" icon={RiGitMergeLine}>
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
        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />

        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />

        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />

        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />
        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />
      </NavSection>

      <NavSection title="CONFIGURATIONS">
        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />
        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />

        <Image
          alt="loading"
          opacity={0.1}
          w={"110px"}
          h="20px"
          src="images/loading.png"
        />
      </NavSection>
    </Stack>
  );
}
