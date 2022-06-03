import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Menu from "@material-ui/core/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Clear from "@material-ui/icons/Clear";
import MenuIcon from "@material-ui/icons/Menu";
import Search from "@material-ui/icons/Search";
import SearchIcon from '@material-ui/icons/Search';
import Grid from "@material-ui/core/Grid";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import TwitterIcon from '@material-ui/icons/Twitter';
import TelegramIcon from '@material-ui/icons/Telegram';
import componentStyles from "assets/theme/components/sidebar.js";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import { useHistory, useLocation, Link } from "react-router-dom";
import axios from "axios";
import config from "config/index.js"
import { save_holder_data, change_header, save_chart_data, save_otherAddress_data, save_symbol_data, save_transaction_data, save_pair_data, save_token_data, save_nft_data } from "redux/actions/provider";
import { useDispatch, useSelector } from "react-redux";
import ChartActIcon from "assets/img/SolviewIcons/Chart/Chart_Blue.svg";
import MediumIcon from "assets/img/icons/medium.svg";
import SwapActIcon from "assets/img/SolviewIcons/Swap/Swap_blue.svg";
import DashboardActIcon from "assets/img/SolviewIcons/Dashboard/Dashboard_blue.svg";
import NftCheckerActIcon from "assets/img/SolviewIcons/NFTChecker/NFT_Blue.svg";
import AddressCheckerActIcon from "assets/img/SolviewIcons/AddressChecker/Address_blue.svg";
import StakingActIcon from "assets/img/SolviewIcons/Staking/staking.svg"
import LauchpadActIcon from "assets/img/SolviewIcons/Farming/Farming_blue.svg"
import "assets/css/components/Sidebar.scss";

const useStyles = makeStyles(componentStyles);

export default function Sidebar({ routes, logo, dropdown, input }) {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [searchData, setSearchData] = useState([])
  const [initData, setInitData] = useState([]);
  const history = useHistory();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    dispatch(change_header('true'));
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //to get solana tokens list for search
  const getTokenList = async () => {
    let responseData = await axios.get(`https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json`);
    setInitData(responseData.data.tokens)
  }

  //to get all pairs of token address
  const getPair = async (value) => {
    var res = await axios.get(`https://api.solscan.io/amm/pairs?source=raydium`);
    res = res.data.data.items;
    if (value != null) {
      var data = res;
      var dod = [];
      for (let i = 0; i < data.length; i++) {
        var name = data[i]['name'];
        if (name.toLowerCase().includes(value.toLowerCase()) || data[i]['address'] == value) {
          dod.push(data[i]);
        }
        else if (data[i]['base'] != null) {
          if (data[i]['base']['address'] == value || data[i]['quote']['address'] == value) {
            dod.push(data[i]);
          }
        }
      }
      res = dod;
      if (res) {
        dispatch(save_pair_data(res))
        if (res[0] && res[0].address) {
          getTrasaction(res[0].address)
        }
      }
    }
  }

  //to get chart data of chosen token
  const getChartData = async (value) => {
    let data = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
    if (data.data && data.data.data) {
      let baseurl = config.serverUrl + '/trade/chart_year';
      let day = new Date();
      let startTime = day.setDate(day.getDate() - 100);
      startTime = (new Date(startTime)).toISOString();
      let endTime = (new Date()).toISOString();
      axios.post(baseurl, { token: data.data.data.symbol, startTime: startTime, endTime: endTime }).then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          console.log(response.data.data, "chart")
          dispatch(save_chart_data(response.data.data))
        }
        else {
          dispatch(save_chart_data(['']))
        }
      })
    }
    else {
      dispatch(save_chart_data(['']))
    }
    // let marketData = await axios.get(`https://api.solscan.io/amm/market?address=${value}&sort_by=liquidity&sort_type=desc`)
    // if (marketData.data.data) {
    //   let day = new Date();
    //   let startTime = day.setDate(day.getDate() - 500);
    //   startTime = ((new Date(startTime)).toISOString());
    //   let endTime = ((new Date()).toISOString());
    //   startTime = ((new Date(startTime)).getTime()) / 1000;
    //   endTime = ((new Date(endTime)).getTime()) / 1000;
    //   let chartData = await axios.get(`https://api.solscan.io/amm/ohlcv?address=${marketData.data.data[0]._id}&type=15m&time_from=${startTime}&time_to=${endTime}`);

    //   if (chartData.data && chartData.data.data && chartData.data.data.items) {
    //     console.log(chartData.data.data.items, "chart Data")
    //     dispatch(save_chart_data(chartData.data.data.items));
    //   }
    //   else {
    //     dispatch(save_chart_data([]));
    //   }
    // }
    // else {
    //   dispatch(save_chart_data([]));

    // }
  }

  //to get transaction of pair address
  const getTrasaction = async (pairAddress) => {
    const res = await axios.get(`https://api.solscan.io/amm/txs?address=${pairAddress}&type=all&offset=0&limit=1`);
    if (res.data.data) {
      dispatch(save_transaction_data(res.data.data.items));
    }
  }

  //to get nft detail data
  const getNFTImage = async (data) => {
    let nftData = [];
    let nftDatakeys = Object.keys(data);
    for (var i = 0; i < nftDatakeys.length; i++) {
      let nftChip = {};
      nftChip.name = data[nftDatakeys[i]][0].name;
      nftChip.count = data[nftDatakeys[i]].length;
      nftChip.address = data[nftDatakeys[i]][0].tokenID;
      let nftUrl = ((data[nftDatakeys[i]][0].uri).split('\u0000'))[0];
      var response = await axios.get(nftUrl);
      if (response.data) {
        nftChip.image = response.data.image;
        nftChip.attr = response.data.attributes;
        nftChip.description = response.data.description;
      }
      else {
        nftChip.attr = '';
        nftChip.image = '';
        nftChip.description = '';
      }
      nftData.push(nftChip);
    }
    dispatch(save_nft_data(nftData));
  }

  //to get nft common data
  const getNFTData = async (value) => {
    let res = {}
    let url = config.serverUrl + '/trade/nftData'
    var response = await axios.post(url, { address: value })
    if (response.data.result === 'success') {
      let data = response.data.data;
      res = data.reduce((acc, curr) => {
        if (!acc[curr.name]) acc[curr.name] = [];
        acc[curr.name].push(curr);
        return acc;
      }, {});
      getNFTImage(res)
    }
  }

  //to get holders of chosen token
  const getHolders = async (value) => {
    let url = `https://api.solscan.io/token/holders?token=${value}&offset=0&size=10`;
    let data = await axios.get(url);
    if (data.data.data) {
      let holderData = data.data.data.result;
      dispatch(save_holder_data(holderData));
    }
  }

  //to get token info
  const getTokenData = async (value) => {
    let responseData = await axios.get(`https://api.solscan.io/account?address=${value}`)
    if (responseData.data.data && responseData.data.data.tokenInfo) {
      let token = {};
      token.tokenAddress = value;
      if (responseData.data.data.tokenInfo.name) {
        token.tokenName = responseData.data.data.tokenInfo.name;
      }
      else {
        token.tokenName = '----';
      }
      if (responseData.data.data.tokenInfo.supply && responseData.data.data.tokenInfo.decimals) {
        token.supply = responseData.data.data.tokenInfo.supply / (10 ** responseData.data.data.tokenInfo.decimals)
      }
      else {
        token.supply = 0;
      }
      if (responseData.data.data.tokenInfo.price) {
        token.priceUst = responseData.data.data.tokenInfo.price;
      }
      let metaData = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
      if (metaData.data.data.icon) {
        token.icon = metaData.data.data.icon;
      }
      else {
        token.icon = '----';
      }

      if (metaData.data.data.holder) {
        token.holder = metaData.data.data.holder;
      }
      else {
        token.holder = 0;
      }
      if (metaData.data.data.website) {
        token.website = metaData.data.data.website;
      }
      if (metaData.data.data.twitter) {
        token.twitter = metaData.data.data.twitter;
      }
      let marketData = await axios.get(`https://api.solscan.io/amm/market?address=${value}&sort_by=liquidity&sort_type=desc`)
      console.log(marketData, "market")
      if (marketData.data.data) {
        let findUsdc = marketData.data.data.filter(item => (item.quote.symbol === 'USDC' || 'USDT'));
        console.log(findUsdc, "mark")
        if (findUsdc[0]) {
          if (findUsdc[0].liquidity) {
            token.liquidity = (findUsdc[0].liquidity).toFixed(3);
          }
          else {
            token.liquidity = 0;
          }
          if (findUsdc[0].price) {
            token.priceUst = (findUsdc[0].price).toFixed(8);
          }
          else {
            token.priceUst = 0
          }
          if (findUsdc[0].volume24h) {
            token.hvolum = (findUsdc[0].volume24h).toFixed(4);
          }
          else {
            token.hvolum = 0;
          }
          if (findUsdc[0].liquidityChangePercentage24h) {
            token.changeprice = (findUsdc[0].liquidityChangePercentage24h).toFixed(3);
          }
          else if (findUsdc[1] && findUsdc[1].liquidityChangePercentage24h) {
            token.changeprice = (findUsdc[1].liquidityChangePercentage24h).toFixed(3);
          }
          else {
            token.changeprice = 0
          }
        } else {
          token.liquidity = 0;
          token.priceUst = 0;
          token.hvolum = 0;
          token.changeprice = 0;
        }
      }
      dispatch(save_token_data(token))
    }
  }

  //to get token symbol
  const getTokenSymbol = async (value) => {
    let data = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
    if (data.data.data && data.data.data.symbol) {
      dispatch(save_symbol_data(data.data.data.symbol));
    }
  }

  //to choose token
  const chooseToken = (address) => {
    history.push('/Chart?token=' + address);
    getTokenSymbol(address);
    getTokenData(address);
    getHolders(address);
    getPair(address);
    getChartData(address);
    setSearchKey("");
    setSearchData([]);
  }
  const sidebarHeader = useSelector((store) => store.provider.sidebar);

  //to choose crrect token for you input 
  const getSearchToken = async (value) => {
    //if current page is Chart page
    var url = window.location.pathname;
    var page = (url.split("/"))[1];
    setSearchKey(value);
    if (page.toLowerCase() === 'chart') {
      if (!value) {
        setSearchData([]);
      }
      else {
        if (value.length > 15) {
          const includeColumns = ['address', 'name', 'symbol'];
          const lowercasedValue = value.toLowerCase().trim();
          const filteredData = initData.filter(item => {
            return Object.keys(item).some(key =>
              includeColumns.includes(key) ? item[key].toString().toLowerCase().includes(lowercasedValue) : false
            );
          });
          if (filteredData.length < 50) {
            setSearchData(filteredData);
          }
          else {
            setSearchData(filteredData.slice(0, 20));
          }
        }
        else {
          const includeColumns = ['name', 'symbol'];
          const lowercasedValue = value.toLowerCase().trim();
          const filteredData = initData.filter(item => {
            return Object.keys(item).some(key =>
              includeColumns.includes(key) ? item[key].toString().toLowerCase().includes(lowercasedValue) : false
            );
          });
          if (filteredData.length < 50) {
            setSearchData(filteredData);
          }
          else {
            setSearchData(filteredData.slice(0, 20));
          }
        }
      }
    }
    else {
      if (page.toLowerCase() === 'nftchecker') {
        getNFTData(value);
      }
      if (page.toLowerCase() === 'addresschecker') {
        dispatch(save_otherAddress_data(value));
      }

    }

  }

  useEffect(() => {
    getTokenList();
    var url = window.location.pathname;
    var page = (url.split("/"))[1];
    var pageId = "/" + page;
    if (document.getElementById(pageId) && document.getElementById(pageId).src) {
      if (pageId == "/Chart") {
        document.getElementById(pageId).src = ChartActIcon;
      }
      if (pageId == "/Swap") {
        document.getElementById(pageId).src = SwapActIcon;
      }
      if (pageId == "/NftChecker") {
        document.getElementById(pageId).src = NftCheckerActIcon;
      }
      if (pageId == "/AddressChecker") {
        document.getElementById(pageId).src = AddressCheckerActIcon;
      }
      if (pageId == "/Dashboard") {
        document.getElementById(pageId).src = DashboardActIcon;
      }
      if (pageId == "/Staking") {
        document.getElementById(pageId).src = StakingActIcon;
      }
      if (pageId == "/Launchpad") {
        document.getElementById(pageId).src = LauchpadActIcon;
      }
    }
  }, [])

  useEffect(() => {
    if (sidebarHeader === 'false') {
      handleMenuClose();
    }
  }, [sidebarHeader])

  const menuId = "responsive-menu-id";
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.divider) {
        return <Divider key={key} classes={{ root: classes.divider }} />;
      } else if (prop.title) {
        return (
          <Typography
            key={key}
            variant="h6"
            component="h6"
            classes={{ root: classes.title }}
          >
            {prop.title}
          </Typography>
        );
      }
      let textContent = (
        <>
          <Box minWidth="2.25rem" id="menu">
            <Box id="image"><img id={prop.path} src={prop.icon}></img></Box>
            {(prop.name === "Launchpad") ? (<Box id="menuname">{prop.name}<span id="menusname"></span></Box>) : (<Box id="menuname">{prop.name}</Box>)}
          </Box>

        </>
      );
      if (prop.href) {
        return (
          <ListItem
            key={key}
            component={"a"}
            href={prop.href}
            onClick={() => handleMenuClose()}
            classes={{
              root:
                classes.listItemRoot +
                (prop.upgradeToPro
                  ? " " + classes.listItemRootUpgradeToPro
                  : ""),
              selected: classes.listItemSelected,
            }}
            target="_blank"
            selected={prop.upgradeToPro === true}
          >
            {textContent}
          </ListItem>
        );
      } else {
        return (
          <ListItem
            key={key}
            component={Link}
            onClick={() => handleMenuClose()}
            to={prop.layout + prop.path}
            classes={{
              root:
                classes.listItemRoot +
                (prop.upgradeToPro
                  ? " " + classes.listItemRootUpgradeToPro
                  : ""),
              selected: classes.listItemSelected,
            }}
            selected={
              location.pathname === prop.layout + prop.path ||
              prop.upgradeToPro === true
            }
          >
            {textContent}
          </ListItem>
        );
      }
    });
  };
  let logoImage = (
    <img alt={logo.imgAlt} id="logoImg" className={classes.logoClasses} src={logo.imgSrc} />
  );
  let logoObject =
    logo && logo.innerLink ? (
      <Link to={logo.innerLink} className={classes.logoLinkClasses}>
        <Grid id="logo" container className="logoIcon">
          <Grid item >{logoImage}</Grid>

        </Grid>
      </Link>
    ) : logo && logo.outterLink ? (
      <a href={logo.outterLink} className={classes.logoLinkClasses}>
        <Grid container id="logo" className="logoIcon">
          <Grid item >{logoImage}</Grid>
          <Grid item>
            <FormControl variant="outlined" fullWidth >
              <InputLabel htmlFor="outlined-adornment-search-responsive">
                Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-search-responsive"
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <Box
                      component={Search}
                      width="1.25rem!important"
                      height="1.25rem!important"
                    />
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </Grid>

        </Grid>
      </a>
    ) : null;
  return (
    <>
      <Hidden smDown implementation="css">
        <Drawer variant="permanent" anchor="left" open>
          <Box paddingBottom="1rem">{logoObject}</Box>
          <List classes={{ root: classes.listRoot }}>
            {createLinks(routes)}
            <Grid cotainer id="contactIcon">
              <Grid item>
                <a href="https://medium.com/@solview" target="_blank" ><img id="MediumIcon" src={MediumIcon}></img></a>
              </Grid>
              <Grid item>
                <a href="https://twitter.com/Solviewapp" target="_blank"><TwitterIcon id="twitterIcon" /></a>
              </Grid>
              <Grid item>
                <a href="https://t.me/solviewofficial" target="_blank"><TelegramIcon id="telegramIcon" /></a>
              </Grid>
            </Grid>
          </List>
        </Drawer>
      </Hidden>
      <Hidden mdUp implementation="css">
        <AppBar position="relative" color="default" id="mobilelogo" elevation={0}>
          <Toolbar>
            <Container
              display="flex!important"
              justifyContent="space-between"
              alignItems="center"
              marginTop=".75rem"
              marginBottom=".75rem"
              component={Box}
              maxWidth={false}
              padding="0!important"
            >
              <Box
                component={MenuIcon}
                id="menuIcon"
                width="2rem!important"
                height="2rem!important"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
              />
              {/* {logoObject} */}
              <Box id="headerSearch">
                <Grid id="inputContainer">
                  <input id="address" placeholder="Search here..." onChange={(e) => { getSearchToken(e.target.value) }} value={searchKey} ></input>
                  <SearchIcon id="searchIcon" />
                </Grid>
                <ul id="searchList">
                  {searchData ? searchData.map((item, key) => (
                    <li key={key} id="eachToken" onClick={() => chooseToken(item.address)}>
                      <Grid container>
                        <Grid item xs={2} xl={2} id="tokenIcon">
                          <img id="tokenSearchIcon" src={item.logoURI}></img>
                        </Grid>
                        <Grid item xs={10}>
                          <Grid id="tokenName" item xs={12} xl={12}>
                            {item.name}
                          </Grid>
                          <Grid id="tokenSymbol" item xs={12} xl={12}>
                            {item.symbol}
                          </Grid>
                        </Grid>
                      </Grid>
                    </li>
                  )) : ''}
                </ul>
              </Box>
              {dropdown}
            </Container>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          classes={{ paper: classes.menuPaper }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft="1.25rem"
            paddingRight="1.25rem"
            paddingBottom="1rem"
            className={classes.outlineNone}
          >
            {logoObject}
            <Box
              component={Clear}
              width="2rem!important"
              height="2rem!important"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleMenuClose}
            />
          </Box>
          <Box
            component={Divider}
            marginBottom="1rem!important"
            marginLeft="1.25rem!important"
            marginRight="1.25rem!important"
          />
          <Box paddingLeft="1.25rem" paddingRight="1.25rem" id="mobileSearch">
            {input}
          </Box>
          <List classes={{ root: classes.listRoot }}>
            {createLinks(routes)}
          </List>
          <Grid cotainer id="contactIcon">
            <Grid item>
              <a href="https://medium.com/@solview" target="_blank" ><img id="MediumIcon" src={MediumIcon}></img></a>
            </Grid>
            <Grid item>
              <a href="https://twitter.com/Solviewapp" target="_blank"><TwitterIcon id="twitterIcon" /></a>
            </Grid>
            <Grid item>
              <a href="https://t.me/solviewofficial" target="_blank"><TelegramIcon id="telegramIcon" /></a>
            </Grid>
          </Grid>
        </Menu>
      </Hidden>
    </>
  );
}

Sidebar.defaultProps = {
  routes: [],
};

Sidebar.propTypes = {
  // this is the input/component that will be rendered on responsive
  // in our demo, we add this input component since the AdminNavbar
  // will not be visible on responsive mode
  input: PropTypes.node,
  // this is the dropdown/component that will be rendered on responsive
  // in our demo, it is the same with the dropdown from the AdminNavbar
  // since the AdminNavbar will not be visible on responsive mode
  dropdown: PropTypes.node,
  // NOTE: we recommend that your logo has the following dimensions
  // // 135x40 or 487x144 or a resize of these dimensions
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // this generates an anchor (<a href="href">..</a>) link
      // this is a link that is sent outside the app
      PropTypes.shape({
        // if this is set to true, than the link will have an absolute position
        // use wisely and with precaution
        upgradeToPro: PropTypes.bool,
        href: PropTypes.string,
        name: PropTypes.string,
        icon: PropTypes.oneOfType([
          // this refers to icons such as ni ni-spaceship or fa fa-heart
          PropTypes.string,
          // this refers to icons from @material-ui/icons
          PropTypes.object,
        ]),
        iconColor: PropTypes.oneOf([
          "Primary",
          "PrimaryLight",
          "Error",
          "ErrorLight",
          "Warning",
          "WarningLight",
          "Info",
          "InfoLight",
        ]),
      }),
      // this generates a Link (<Link to="layout + path">..</Link>) link
      // this is a link that is sent inside the app
      PropTypes.shape({
        path: PropTypes.string,
        name: PropTypes.string,
        layout: PropTypes.string,
        component: PropTypes.func,
        icon: PropTypes.oneOfType([
          // this refers to icons such as ni ni-spaceship or fa fa-heart
          PropTypes.string,
          // this refers to icons from @material-ui/icons
          PropTypes.object,
        ]),
        iconColor: PropTypes.oneOf([
          "Primary",
          "PrimaryLight",
          "Error",
          "ErrorLight",
          "Warning",
          "WarningLight",
          "Info",
          "InfoLight",
        ]),
      }),
      // this is just a title without any action on it
      // you can think of it as a disabled link
      PropTypes.shape({
        title: PropTypes.string,
      }),
      // this is just a divider line
      PropTypes.shape({
        divider: true,
      }),
    ])
  ),
};
