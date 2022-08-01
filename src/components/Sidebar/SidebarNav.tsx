import { Stack } from "@chakra-ui/react";
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
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { MdOutlineBadge } from "react-icons/md";
import { Can } from "../can";
import { LoginContext } from "../../contexts/LoginContext";
import { useContext, useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";

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
    <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
        <NavLink hasPermission={true} hrefs="/home" icon={HiOutlineHome}>
          Home
        </NavLink>

        <Can roles={["ADMINISTRATOR"]}>
          <NavLink
            hasPermission={true}
            hrefs="/approvals"
            icon={RiDashboardLine}
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
          user.permissions.every(permission => permission == "SCHEDULE") ? (
            <NavLink hasPermission={true} hrefs="/schedule" icon={RiTimeLine}>
            Schedule
          </NavLink>
          ) : (
            <NavLink hasPermission={false} hrefs="/schedule" icon={RiTimeLine}>
            Schedule
          </NavLink>
          )
         : (
          'dsasd'
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
            Speedways
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
        <Can roles={["USER"]}>
          <NavLink hasPermission={true} hrefs="/company" icon={BiBuilding}>
            Company
          </NavLink>
        </Can>
      </NavSection>
    </Stack>
  );
}
