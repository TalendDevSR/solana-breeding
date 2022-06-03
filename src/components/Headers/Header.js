import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "assets/css/components/Header.scss"
import componentStyles from "assets/theme/components/admin-navbar.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import SearchIcon from "@material-ui/icons/Search";
// import settingPng from "assets/img/SolviewIcons/ChartPage/Setting.svg";
import solviewPng from "assets/img/brand/solview_1.png"
import { save_holder_data, save_gainer_data, save_chart_data, save_loser_data, save_address_data, save_otherAddress_data, save_promoted_data, save_transaction_data, save_symbol_data, save_pair_data, save_token_data, save_nft_data } from "redux/actions/provider";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import config from "config/index.js"
import { clusterApiUrl } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, createConnectionConfig, } from "@nfteyez/sol-rayz";
require('@solana/wallet-adapter-react-ui/styles.css');

const useStyles = makeStyles(componentStyles);

export default function Header() {

  const history = useHistory();
  const dispatch = useDispatch();
  const { publicKey } = useWallet();
  const [solvPrice, setSolvPrice] = useState(0);
  const [searchData, setSearchData] = useState([])
  const [initData, setInitData] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  ///==============function=======================///

  //to get wallet address that is connected
  const getWalletAddress = async () => {
    dispatch(save_address_data(publicKey.toBase58()));
  }

  //to get solana tokens list for search
  const getTokenList = async () => {
    let responseData = await axios.get(`https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json`);
    setInitData(responseData.data.tokens)
  }

  //to get current solview token price
  const getSolvPrice = async () => {
    let url = config.serverUrl + "/trade/trade";
    let tokenData = await axios.post(url, { token: 'SOLV' });
    let data = tokenData.data.data.items[0];
    if (data && data.price) {
      setSolvPrice(parseFloat(data.price));
    }
  }

  //to get transaction of pair address
  const getTrasaction = async (pairAddress) => {
    const res = await axios.get(`https://api.solscan.io/amm/txs?address=${pairAddress}&type=all&offset=0&limit=1`);
    if (res.data.data) {
      dispatch(save_transaction_data(res.data.data.items));
    }
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

  //to get biggest gainers
  const getGainer = async () => {
    let gainerData = await axios.get('https://api.solscan.io/tokens?offset=0&limit=10&sortby=price_change_24h&sorttype=desc');
    if (gainerData.data.data && gainerData.data.data.tokens) {
      dispatch(save_gainer_data(gainerData.data.data.tokens));
    }
  }

  //to get biggest losers
  const getLoser = async () => {
    let data = await axios.get('https://api.solscan.io/tokens?offset=0&limit=10&sortby=price_change_24h&sorttype=asc');
    let LoserData = data.data.data.tokens;
    if (data.data.data) {
      dispatch(save_loser_data(LoserData));
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

  //to get promoted token data
  const getPromotedData = async () => {
    let url = config.serverUrl + "/trade/trade";
    let promotedData = await axios.get(config.serverUrl + "/trade/initData");
    let promotedTokenList = [];
    promotedData = promotedData.data.data;

    for (let i = 0; i < promotedData.length; i++) {
      let token = {};
      let responseData = await axios.get(`https://api.solscan.io/account?address=${promotedData[i].coinAddress}`)
      if (responseData.data.data && responseData.data.data.tokenInfo) {
        token.mintAddress = promotedData[i].coinAddress;
        if (responseData.data.data.tokenInfo.name) {
          token.tokenName = responseData.data.data.tokenInfo.name;
        }
        else {
          token.tokenName = '----';
        }

        if (responseData.data.data.tokenInfo.price) {
          token.priceUst = responseData.data.data.tokenInfo.price;
        }
        let metaData = await axios.get(`https://api.solscan.io/token/meta?token=${promotedData[i].coinAddress}`);
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
          token.holder = '----';
        }

        let marketData = await axios.get(`https://api.solscan.io/amm/market?address=${promotedData[i].coinAddress}&sort_by=liquidity&sort_type=desc`)
        if (marketData.data.data) {
          let findUsdc = marketData.data.data.filter(item => item.quote.symbol == 'USDC');
          if (findUsdc[0]) {
            if (findUsdc[0].price) {
              token.priceUst = (findUsdc[0].price).toFixed(5);
            }
            else {
              token.priceUst = '----'
            }
            if (findUsdc[0].volume24h) {
              token.hvolum = (findUsdc[0].volume24h).toFixed(2);
            }
            else {
              token.hvolum = '----';
            }
            if (findUsdc[0].liquidityChangePercentage24h) {
              token.changeprice = (findUsdc[0].liquidityChangePercentage24h).toFixed(2);
            }
            else {
              token.changeprice = '----'
            }
          }
        }
        promotedTokenList.push(token);
      }
    }
    dispatch(save_promoted_data(promotedTokenList));
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
        token.tokenName = '';
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
      else {
        token.priceUst = 0
      }
      let metaData = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
      if (metaData.data.data.icon) {
        token.icon = metaData.data.data.icon;
      }
      else {
        token.icon = '';
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
      console.log(token, "token")
      dispatch(save_token_data(token))
    }
  }

  const getNFTData = async (value) => {
    try {
      const connect = createConnectionConfig(clusterApiUrl("mainnet-beta"));
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: value,
        connection: connect,
        serialization: true,
      });
      let nftData = {};
      nfts.map((item, key) => {
        if (!nftData[item.updateAuthority]) {
          nftData[item.updateAuthority] = [item]
        }
        else {
          nftData[item.updateAuthority].push(item)
        }
      })
      dispatch(save_nft_data(nftData));
    } catch (error) {
      console.log(error);
    }
  };

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
        dispatch(save_nft_data([]));
        getNFTData(value);
      }
      if (page.toLowerCase() === 'addresschecker') {
        dispatch(save_otherAddress_data(value));
      }
    }
  }

  //when the user selects the token
  const chooseToken = (address) => {
    history.push('/Chart?token=' + address);
    getTokenSymbol(address);
    getTokenData(address);
    getChartData(address);
    getHolders(address);
    getPair(address);
    setSearchKey("");
    setSearchData([]);
  }

  //to get token symbol
  const getTokenSymbol = async (value) => {
    let data = await axios.get(`https://api.solscan.io/token/meta?token=${value}`);
    if (data.data && data.data.data) {
      dispatch(save_symbol_data(data.data.data.symbol));
    }
  }

  //when users connect to their wallet
  useEffect(() => {
    if (publicKey) {
      getWalletAddress();
    }
  }, [publicKey])

  useEffect(() => {
    getTokenList();
    getSolvPrice();
    getGainer();
    getLoser();
    getPromotedData();
    var url = window.location.pathname;
    var url_para = window.location.href;
    var url_para_data = new URL(url_para);
    var url_para_address = url_para_data.searchParams.get("token");
    var page = (url.split("/"))[1];
    if (page.toLowerCase() === 'chart') {
      if (url_para_address) {
        getTokenSymbol(url_para_address);
        getTokenData(url_para_address);
        getChartData(url_para_address);
        getPair(url_para_address);
        getHolders(url_para_address);
      }
      else {
        getTokenSymbol('7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN');
        getTokenData('7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN');
        getChartData('7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN');
        getPair('7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN');
        getHolders('7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN');
      }
    }
  }, []);

  const classes = useStyles();
  return (
    <>
      <AppBar id="mainHeader">
        <Toolbar disableGutters>
          <Container
            maxWidth={false}
            component={Grid}
            classes={{ root: classes.containerRoot }}
          >
            <Grid
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              id="header"
            >
              <Grid display="flex" container alignItems="center" width="auto">
                <Grid
                  item
                  xs={6}
                  xl={6}
                  sm={12}
                  display="flex"
                  alignItems="center"
                  id="searchBox"
                >
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
                </Grid>
                <Grid item xs={2} xl={3} sm={6} className="buttonGroup" >
                  <Button id="usdButton1" onClick={() => getSolvPrice}>USD</Button>
                  <Button id="usdButton2"><img id="usd" src={solviewPng}></img>&nbsp;${(solvPrice).toFixed(4)}</Button>
                </Grid>
                <Grid item xs={4} xl={3} sm={6} className="buttonGroup1">
                  <WalletMultiButton id="walletConnect" />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  );
}
