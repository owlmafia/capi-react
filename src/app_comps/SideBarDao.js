import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaAddressBook, FaAnchor } from "react-icons/fa";
import { MyAccount } from "./MyAccount";

export const SideBarDao = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  setMyBalance,
  statusMsgUpdater,
}) => {
  return (
    <ProSidebar>
      <SidebarHeader>
        <div
          style={{
            height: "80px",
            padding: "50px 20px 50px 20px",
          }}
        >
          <div
            style={{
              backgroundColor: "blue",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaAddressBook />}>
            <Link to="">Home</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="roadmap">Roadmap</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="stats">Stats</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="investment">My investment</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdraw">Withdraw</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdrawal_history">Funds activity</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <MyAccount
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          setMyBalance={setMyBalance}
          statusMsgUpdater={statusMsgUpdater}
        />
      </SidebarFooter>
    </ProSidebar>
  );
};
