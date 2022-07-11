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
import { useContext } from "react";

export function SidebarNav() {
  const { user } = useContext(LoginContext);

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
        <NavLink hrefs="/home" icon={HiOutlineHome}>
          Home
        </NavLink>

        <Can roles={["ADMINISTRATOR"]}>
          <NavLink hrefs="/dashboard" icon={RiDashboardLine}>
            Adm Dashboard
          </NavLink>
        </Can>

        <NavLink hrefs="/userdashboard" icon={RiDashboardLine}>
          Dashboard
        </NavLink>

        <NavLink hrefs="/schedule" icon={RiTimeLine}>
          Schedule
        </NavLink>

        <Can roles={["ADMINISTRATOR"]}>
          <NavLink hrefs="/users" icon={RiContactsLine}>
            Users
          </NavLink>
          <NavLink hrefs="/administrators" icon={RiContactsLine}>
            Administrators
          </NavLink>
          <NavLink hrefs="/companies" icon={BiBuilding}>
            Companies
          </NavLink>
          <NavLink hrefs="/speedways" icon={BsSpeedometer2}>
            Speedways
          </NavLink>
        </Can>
      </NavSection>

      <NavSection title="CONFIGURATIONS">
        <NavLink hrefs="/settings" icon={VscSettingsGear}>
          Settings
        </NavLink>
        <NavLink hrefs="/driverlicence" icon={MdOutlineBadge}>
          Driver Licence
        </NavLink>
        <Can roles={["USER"]}>
          <NavLink hrefs="/company" icon={BiBuilding}>
            Company
          </NavLink>
        </Can>
      </NavSection>
    </Stack>
  );
}
