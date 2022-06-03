
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
// import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import OutlinedInput from "@material-ui/core/OutlinedInput";
// import Sidebar from "components/Sidebar/Sidebar.js";
// import NavbarDropdown from "components/Dropdowns/NavbarDropdown.js";
// import routes from "routes.js";
import config from "config/index.js"
import componentStyles from "assets/theme/layouts/admin.js";
// import ChartView from "views/main/Chart";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { save_holder_data, save_symbol_data, save_chart_data, change_header, save_pair_data, save_transaction_data, save_token_data } from "redux/actions/provider";
import axios from "axios";

const useStyles = makeStyles(componentStyles);
const ChartLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState("");
  const [searchData, setSearchData] = useState([])
  const [initData, setInitData] = useState([]);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  //to get transaction of pair address
  const getTrasaction = async (pairAddress) => {
    const res = await axios.get(`https://api.solscan.io/amm/txs?address=${pairAddress}&type=all&offset=0&limit=1`);
    if (res.data.data) {
      dispatch(save_transaction_data(res.data.data.items));
    }
  }

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
            token.priceUst = 0;
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

  //to get chart data
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
  }

  //to get token symbol
  const getTokenSymbol = async (value) => {
    let data = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
    if (data.data.data && data.data.data.symbol) {
      dispatch(save_symbol_data(data.data.data.symbol));
    }
  }

  //to choose crrect token for you input 
  const getSearchToken = async (value) => {
    setSearchKey(value);
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

  //when the user selects the token
  const chooseToken = (address) => {
    dispatch(change_header('false'))
    history.push('/Chart?token=' + address);
    getTokenSymbol(address);
    getTokenData(address);
    getChartData(address);
    getPair(address);
    getHolders(address);
    setSearchKey("");
    setSearchData([]);
  }
  useEffect(() => {
    getTokenList();
  }, []);

  return (
    <>
      <>
        {/* <Sidebar
          routes={routes}
          logo={{
            innerLink: "/Chart",
            imgSrc: require("../assets/img/brand/solview.png").default,
            imgAlt: "...",
          }}
          dropdown={<NavbarDropdown />}
          input={
            <FormControl variant="outlined" fullWidth >
              <InputLabel htmlFor="outlined-adornment-search-responsive">
                Address
              </InputLabel>
              <OutlinedInput
                value={searchKey} onChange={(e) => { getSearchToken(e.target.value) }}
                id="outlined-adornment-search-responsive"
                type="text"

                labelWidth={70}
              />
              <ul id="searchList">
                {searchData ? searchData.map((item, key) => (
                  <li key={key} id="eachToken" onClick={() => chooseToken(item.address)}>
                    <Grid container>
                      <Grid item id="tokenIcon">
                        <img id="tokenSearchIcon" src={item.logoURI}></img>
                      </Grid>
                      <Grid item>
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
            </FormControl>
          }
        /> */}
        <Box position="relative" className={classes.mainContent}>
          {/* <ChartView /> */}
          <Container
            maxWidth={false}
            component={Box}
            classes={{ root: classes.containerRoot }}
          >
          </Container>
        </Box>
      </>
    </>
  );
};

export default ChartLayout;
