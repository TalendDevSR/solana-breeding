import Dashboard from "views/main/Dashboard.js";
import Chart from "views/main/Chart.js";
import NFTChecker from "views/main/NFTChecker.js"
import AddressChecker from "views/main/AddressChecker.js"
import Staking from "views/main/Staking.js"

import AddressCheckerIcon from "assets/img/SolviewIcons/AddressChecker/Address_white.svg"
import ChartIcon from "assets/img/SolviewIcons/Chart/Chart_White.svg"
import SwapIcon from "assets/img/SolviewIcons/Swap/Swap_white.svg"
import DashoboardIcon from "assets/img/SolviewIcons/Dashboard/Dashboard_white.svg"
import StakingIcon from "assets/img/SolviewIcons/Staking/staking_white.svg"
import NftCheckerIcon from "assets/img/SolviewIcons/NFTChecker/NFTWhite.svg";
import FarmingIcon from "assets/img/SolviewIcons/Farming/Farming_white.svg"
import PromoteIcon from "assets/img/SolviewIcons/PromoteToken/Prmote_white.svg"
var routes = [

  {
    path: "/Chart",
    name: "Chart",
    icon: ChartIcon,
    iconColor: "Primary",
    component: Chart,
    layout: "",
  },
  {
    path: "/NftChecker",
    name: "NFT Checker",
    icon: NftCheckerIcon,
    iconColor: "WarningLight",
    component: NFTChecker,
    layout: "",
  },
  {
    path: "/AddressChecker",
    name: "Address Checker",
    icon: AddressCheckerIcon,
    iconColor: "WarningLight",
    component: AddressChecker,
    layout: "",
  },
  {
    path: "/Swap",
    name: "Swap",
    icon: SwapIcon,
    iconColor: "WarningLight",
    component: Dashboard,
    layout: "",
  },
  {
    divider: true,
  },
  {
    title: "Your Portfolio"
  },
  {
    path: "/Dashboard",
    name: "Dashboard",
    icon: DashoboardIcon,
    iconColor: "Error",
    component: Dashboard,
    layout: "",
  },
  {
    divider: true,
  },
  {
    title: "Earn With US"
  },
  {
    path: "/Staking",
    name: "Staking",
    icon: StakingIcon,
    iconColor: "ErrorLight",
    component: Staking,
    layout: "",
  },
  {
    path: "/Launchpad",
    name: "Launchpad",
    icon: FarmingIcon,
    iconColor: "ErrorLight",
    component: Dashboard,
    layout: "",
  },
  {
    path: "/maps",
    name: "Promote Token",
    icon: PromoteIcon,
    iconColor: "Warning",
    component: Dashboard,
    layout: "",
  },

];
export default routes;
