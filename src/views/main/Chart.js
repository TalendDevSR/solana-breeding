import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import buyPng from "assets/img/SolviewIcons/ChartPage/Buy.svg";
import sellPng from "assets/img/SolviewIcons/ChartPage/Sell.svg";
import "assets/css/views/Chart.scss";
import componentStyles from "assets/theme/views/admin/dashboard.js";
import { useSelector } from "react-redux";
import Sell from "assets/img/icons/trade_sell.png";
import Buy from "assets/img/icons/trade_buy.png";
import config from "config/index.js";
import {
  save_pair_data,
  save_chart_data,
  save_token_data,
  save_symbol_data,
  save_transaction_data,
  save_holder_data,
} from "redux/actions/provider";
import { useDispatch } from "react-redux";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import axios from "axios";
import promotedPng from "assets/img/SolviewIcons/PromoteToken/Prmote_white.svg";
import gainerdPng from "assets/img/SVGG/trend-up_White.svg";
import trendPng from "assets/img/SVGG/trade_White.svg";
import holderPng from "assets/img/SVGG/holder.svg";
import pairPng from "assets/img/SVGG/pair.svg";
import loserPng from "assets/img/SVGG/trend-down_White.svg";
import TwitterIcon from "@material-ui/icons/Twitter";
import TradingView from "./TradingView";

const useStyles = makeStyles(componentStyles);

function ChartView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const tokendata = useSelector((store) => store.provider.token);
  const promotedData = useSelector((store) => store.provider.promoted);
  const transactiondata = useSelector((store) => store.provider.transaction);
  const holderData = useSelector((store) => store.provider.holder);
  const pair = useSelector((store) => store.provider.pair);
  const gainerData = useSelector((store) => store.provider.gainer);
  const loserData = useSelector((store) => store.provider.loser);
  const [tradeType, setTradeType] = useState("trade"); //holder
  const [topTokenType, setTopTokenType] = useState("promoted");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("copy");
  const [trendData, setTrendData] = useState([]);
  const [tokenBuyLink, setTokenBuyLink] = useState(
    "https://raydium.io/swap/?from=7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  );
  const [traPair, setTraPair] = useState("default");

  //to get transactions
  const getTrasaction = async (pairAddress) => {
    setTraPair(pairAddress);
    const res = await axios.get(
      `https://api.solscan.io/amm/txs?address=${pairAddress}&type=all&offset=0&limit=10`
    );
    dispatch(save_transaction_data(res.data.data.items));
  };

  //when user clicks transaction more button
  const getMoreTransaction = async () => {
    const before_id = transactiondata[transactiondata.length - 1]._id;
    const before_time =
      transactiondata[transactiondata.length - 1].blockUnixTime;
    if (traPair === "default") {
      const res = await axios.get(
        `https://api.solscan.io/amm/txs?address=${pair[0].address}&type=all&offset=0&limit=10&before_id=${before_id}&before_time=${before_time}`
      );
      const traMoreData = transactiondata;
      var traData = traMoreData.concat(res.data.data.items);
      dispatch(save_transaction_data(traData));
    } else {
      const res = await axios.get(
        `https://api.solscan.io/amm/txs?address=${traPair}&type=all&offset=0&limit=10&before_id=${before_id}&before_time=${before_time}`
      );
      const traMoreData = transactiondata;
      var traData = traMoreData.concat(res.data.data.items);

      dispatch(save_transaction_data(traData));
    }
  };

  //to get holders of chosen token
  const getHolders = async (value) => {
    let url = `https://api.solscan.io/token/holders?token=${value}&offset=0&size=10`;
    let data = await axios.get(url);
    if (data.data.data) {
      let holderData = data.data.data.result;
      dispatch(save_holder_data(holderData));
    }
  };

  //to get token symbol
  const getTokenSymbol = async (value) => {
    let data = await axios.get(
      `https://api.solscan.io/token/meta?token=${value}`
    );
    if (data.data.data && data.data.data.symbol) {
      dispatch(save_symbol_data(data.data.data.symbol));
    }
  };

  //to get token buy/sell pair
  const getPair = async (value) => {
    var res = await axios.get(
      `https://api.solscan.io/amm/pairs?source=raydium`
    );
    res = res.data.data.items;
    if (value != null) {
      var data = res;
      var dod = [];
      for (let i = 0; i < data.length; i++) {
        var name = data[i]["name"];
        if (
          name.toLowerCase().includes(value.toLowerCase()) ||
          data[i]["address"] == value
        ) {
          dod.push(data[i]);
        } else if (data[i]["base"] != null) {
          if (
            data[i]["base"]["address"] == value ||
            data[i]["quote"]["address"] == value
          ) {
            dod.push(data[i]);
          }
        }
      }
      res = dod;
      if (res.length > 0) {
        dispatch(save_pair_data(res));
        getTrasaction(res[0].address);
      }
    }
  };

  //to get token data
  const getData = async (value) => {
    let responseData = await axios.get(
      `https://api.solscan.io/account?address=${value}`
    );
    if (responseData.data.data && responseData.data.data.tokenInfo) {
      let token = {};
      token.tokenAddress = value;
      if (responseData.data.data.tokenInfo.name) {
        token.tokenName = responseData.data.data.tokenInfo.name;
      } else {
        token.tokenName = "----";
      }
      if (
        responseData.data.data.tokenInfo.supply &&
        responseData.data.data.tokenInfo.decimals
      ) {
        token.supply =
          responseData.data.data.tokenInfo.supply /
          10 ** responseData.data.data.tokenInfo.decimals;
      } else {
        token.supply = 0;
      }
      if (responseData.data.data.tokenInfo.price) {
        token.priceUst = responseData.data.data.tokenInfo.price;
      }
      let metaData = await axios.get(
        `https://api.solscan.io/token/meta?token=${value}`
      );
      if (metaData.data.data.icon) {
        token.icon = metaData.data.data.icon;
      } else {
        token.icon = "----";
      }

      if (metaData.data.data.holder) {
        token.holder = metaData.data.data.holder;
      } else {
        token.holder = 0;
      }
      if (metaData.data.data.website) {
        token.website = metaData.data.data.website;
      }
      if (metaData.data.data.twitter) {
        token.twitter = metaData.data.data.twitter;
      }
      let marketData = await axios.get(
        `https://api.solscan.io/amm/market?address=${value}&sort_by=liquidity&sort_type=desc`
      );
      console.log(marketData, "market");
      if (marketData.data.data) {
        let findUsdc = marketData.data.data.filter(
          (item) => item.quote.symbol === "USDC" || "USDT"
        );
        console.log(findUsdc, "mark");
        if (findUsdc[0]) {
          if (findUsdc[0].liquidity) {
            token.liquidity = findUsdc[0].liquidity.toFixed(3);
          } else {
            token.liquidity = 0;
          }
          if (findUsdc[0].price) {
            token.priceUst = findUsdc[0].price.toFixed(8);
          } else {
            token.priceUst = 0;
          }
          if (findUsdc[0].volume24h) {
            token.hvolum = findUsdc[0].volume24h.toFixed(4);
          } else {
            token.hvolum = 0;
          }
          if (findUsdc[0].liquidityChangePercentage24h) {
            token.changeprice =
              findUsdc[0].liquidityChangePercentage24h.toFixed(3);
          } else if (findUsdc[1] && findUsdc[1].liquidityChangePercentage24h) {
            token.changeprice =
              findUsdc[1].liquidityChangePercentage24h.toFixed(3);
          } else {
            token.changeprice = 0;
          }
        } else {
          token.liquidity = 0;
          token.priceUst = 0;
          token.hvolum = 0;
          token.changeprice = 0;
        }
      }
      dispatch(save_token_data(token));
    }
  };

  //to get chart data of chosen token
  const getChartData = async (value) => {
    let data = await axios.get(
      `https://api.solscan.io/token/meta?token=${value}`
    );
    if (data.data && data.data.data) {
      let baseurl = config.serverUrl + "/trade/chart_year";
      let day = new Date();
      let startTime = day.setDate(day.getDate() - 100);
      startTime = new Date(startTime).toISOString();
      let endTime = new Date().toISOString();
      axios
        .post(baseurl, {
          token: data.data.data.symbol,
          startTime: startTime,
          endTime: endTime,
        })
        .then((response) => {
          if (response.data.data && response.data.data.length > 0) {
            console.log(response.data.data, "chart");
            dispatch(save_chart_data(response.data.data));
          } else {
            dispatch(save_chart_data([""]));
          }
        });
    } else {
      dispatch(save_chart_data([""]));
    }
  };

  const differenceInMinutes = (dateVal) => {
    let dateOne = new Date();
    let dateTwo = new Date(dateVal);
    let msDifference = dateTwo - dateOne;
    let minutes = Math.floor(msDifference / 1000 / 60);
    return minutes * -1;
  };

  //when click gainer, loser,promoted tokens
  const promotedToken = (value) => {
    history.push("/Chart?token=" + value);
    getData(value);
    getTokenSymbol(value);
    getChartData(value);
    getPair(value);
    getHolders(value);
  };

  //to get banner data
  const getBanner = async () => {
    const result = await axios.get(config.serverUrl + "/banner/init");
    if (result.data.data) {
      setBannerImage(config.adminUrl + "/" + result.data.data[0].filename);
      setBannerUrl(result.data.data[0].url);
    }
  };

  //to copy token address
  const copyAddress = async (text) => {
    if ("clipboard" in navigator) {
      setCopyStatus("copied!");
      setTimeout(() => {
        setCopyStatus("copy");
      }, 1000);
      return await navigator.clipboard.writeText(text);
    } else {
      setCopyStatus("copied!");
      setTimeout(() => {
        setCopyStatus("copy");
      }, 1000);
      return document.execCommand("copy", true, text);
    }
  };

  //to get trend tokens
  const getTrend = async () => {
    var url = "https://api.solscan.io/token/tokenTrending";
    var data = await axios.get(url);
    if (data.data.data) {
      setTrendData(data.data.data);
    }
  };

  useEffect(() => {
    getTrend();
  }, []);
  useEffect(() => {
    getBanner();
    var url = window.location.pathname;
    var url_para = window.location.href;
    var url_para_data = new URL(url_para);
    var url_para_address = url_para_data.searchParams.get("token");
    if (!url_para_address) {
      setTokenBuyLink(
        "https://raydium.io/swap/?from=7q3AdgKuMeDRnjaMQs7ppXjaw4HUxjsdyMrrfiSZraiN&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      );
    } else {
      setTokenBuyLink(
        `https://raydium.io/swap/?from=${url_para_address}&to=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
      );
    }
  });

  return (
    <>
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-9rem"
        id="chartContainer"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            xl={12}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.gridItemRoot }}
          >
            <Card
              classes={{
                root: classes.cardRoot + " " + classes.cardRootBgGradient,
              }}
              id="chartMainContent"
            >
              <Grid id="banner" container>
                <Grid item id="bannerContent">
                  <a
                    id="bannerUrl"
                    href={bannerUrl ? bannerUrl : ""}
                    target="_blank"
                  >
                    <img
                      src={bannerImage ? bannerImage : ""}
                      id="bannerImage"
                    />
                  </a>
                </Grid>
              </Grid>
              <CardHeader
                id="chartHeader"
                subheader={
                  <Grid container>
                    <Grid item container xs={12} xl={12}>
                      <Grid item xs={2} xl={2} id="trendName">
                        Trending
                      </Grid>
                      <Grid item xs={10} xl={10}>
                        <marquee
                          id="trendMarquee"
                          onMouseOver={(e) => {
                            document.getElementById("trendMarquee").stop();
                          }}
                          onMouseOut={(e) => {
                            document.getElementById("trendMarquee").start();
                          }}
                          loop={0}
                        >
                          {trendData
                            ? trendData.map((item, key) => (
                                <a
                                  id="trendToken"
                                  key={key}
                                  onClick={() => promotedToken(item.token)}
                                >
                                  #{key + 1}&nbsp;
                                  {item.tokenData.symbol
                                    ? item.tokenData.symbol
                                    : "Unknown"}
                                </a>
                              ))
                            : ""}
                        </marquee>
                      </Grid>
                    </Grid>
                    {/* <Grid item container xs={12} xl={6}>
                                            <Grid item xs={2} xl={2} id="newName">Newly Listed</Grid>
                                            <Grid item xs={10} xl={10}>
                                                <marquee id="newMarquee" onMouseOver={(e) => { document.getElementById('newMarquee').stop() }} onMouseOut={(e) => { document.getElementById('newMarquee').start() }} loop={0}>
                                                    {newPairData ? newPairData.map((item, key) => (
                                                        <a id='newToken' key={key} onClick={() => promotedToken(item.base.address)}>#{key + 1}&nbsp;{item.name}</a>
                                                    )) : ''}
                                                </marquee>
                                            </Grid>
                                        </Grid> */}
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot1 }}
              ></CardHeader>

              <CardHeader
                id="chartHeader"
                subheader={
                  <Grid
                    id="headercontent"
                    container
                    component={Box}
                    alignItems="center"
                  >
                    <Grid container item xl={4} xs={12}>
                      <Grid item xs={3} xl={3}>
                        <img
                          id="tokenicon"
                          src={tokendata ? tokendata.icon : ""}
                        ></img>
                      </Grid>
                      <Grid item xs={9} xl={9}>
                        <Box
                          component={Typography}
                          variant="h5"
                          id="tokenName"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box component="span" color={theme.palette.gray[400]}>
                            {tokendata ? tokendata.tokenName : ""}
                          </Box>
                        </Box>
                        <Box
                          component={Typography}
                          variant="h2"
                          id="tokenPrice"
                          marginBottom="0!important"
                        >
                          <Box component="span" color="white" id="price">
                            {tokendata ? "$" + tokendata.priceUst : ""}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                          </Box>
                          {tokendata ? (
                            tokendata.changeprice > 0 ? (
                              <Box
                                id="percent"
                                component="span"
                                color="rgb(0, 224, 142)"
                              >
                                {tokendata.changeprice}%
                              </Box>
                            ) : (
                              <Box component="span" color="red" id="percent">
                                {tokendata.changeprice}%
                              </Box>
                            )
                          ) : (
                            ""
                          )}
                        </Box>
                        <Box
                          component={Typography}
                          variant="h5"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box
                            component="span"
                            id="tokenAddress"
                            color={theme.palette.gray[400]}
                          >
                            {tokendata ? (
                              <Box>
                                {tokendata.tokenAddress.slice(0, 10) + "..."}
                                <Tooltip placement="top" title={copyStatus}>
                                  <IconButton
                                    onClick={(e) =>
                                      copyAddress(tokendata.tokenAddress)
                                    }
                                    aria-label="delete"
                                    id="copyButton"
                                  >
                                    <FileCopyOutlinedIcon
                                      title="copy"
                                      id="copy"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              ""
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container id="Grid2" item xl={6} xs={8}>
                      <Grid item xs={3} xl={3} id="grid2">
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h5"
                          id="hVol"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box component="span" color="#8f898e" id="headerval">
                            24h Volume
                          </Box>
                        </Grid>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h2"
                          id="hVal"
                          marginBottom="0!important"
                        >
                          <Box component="span" color="white" class="allvalue">
                            {tokendata ? "$" + tokendata.hvolum : ""}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        container
                        justifyContent="space-between"
                      >
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h5"
                          id="holderVol"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box component="span" color="#8f898e" id="headerval">
                            Total Holders
                          </Box>
                        </Grid>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h2"
                          id="holderVal"
                          marginBottom="0!important"
                        >
                          <Box component="span" color="white" class="allvalue">
                            {tokendata ? tokendata.holder : ""}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item container xs={3}>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h5"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box component="span" color="#8f898e" id="headerval">
                            Max Supply
                          </Box>
                        </Grid>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h2"
                          marginBottom="0!important"
                          color="white"
                        >
                          <Box component="span" color="white" class="allvalue">
                            {tokendata ? tokendata.supply : ""}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item container xs={3}>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h5"
                          letterSpacing=".0625rem"
                          marginBottom=".25rem!important"
                          className={classes.textUppercase}
                        >
                          <Box component="span" color="#8f898e" id="headerval">
                            Liquidity
                          </Box>
                        </Grid>
                        <Grid
                          xs={12}
                          component={Typography}
                          variant="h2"
                          marginBottom="0!important"
                          color="white"
                        >
                          <Box component="span" color="white" class="allvalue">
                            {tokendata ? tokendata.liquidity : ""}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container id="butgroup" item xl={2} xs={4}>
                      <Grid item xs={12}>
                        <button
                          id="buyButton"
                          onClick={() => {
                            window.open(tokenBuyLink, "_blank");
                          }}
                        >
                          <img id="buypng" src={buyPng}></img>&nbsp;&nbsp;
                          <span>Buy</span>
                        </button>
                      </Grid>
                      <Grid item xs={12}>
                        <button
                          id="buyButton"
                          onClick={() => {
                            window.open(tokenBuyLink, "_blank");
                          }}
                        >
                          <img id="sellpng" src={sellPng}></img>&nbsp;&nbsp;
                          <span>Sell</span>
                        </button>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot1 }}
              ></CardHeader>
              <CardContent id="chartBox">
                <TradingView />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container component={Box} marginTop="3rem">
          <Grid
            item
            xs={12}
            xl={2}
            component={Box}
            classes={{ root: classes.gridItemRoot }}
          >
            <Card id="pairTable" classes={{ root: classes.cardRoot }}>
              <TableContainer id="pairContainer">
                <Box
                  component={Table}
                  alignItems="center"
                  marginBottom="0!important"
                >
                  <TableHead id="pairTbHeader">
                    <TableRow>
                      <TableCell id="pairHeader">PAIR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!pair
                      ? ""
                      : pair.map((item, index) => (
                          <TableRow id="topCell" key={index}>
                            <TableCell
                              id="pairCell"
                              onClick={(e) => getTrasaction(item.address)}
                            >
                              <Button>
                                {" "}
                                {`${item.base.symbol}-${item.quote.symbol}`}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Box>
              </TableContainer>
            </Card>
            <Card id="tokenInfoTable" classes={{ root: classes.cardRoot }}>
              <CardHeader
                id="pairButton"
                subheader={
                  <Button id="tokenPair">
                    <img src={pairPng}></img>&nbsp;Token Info
                  </Button>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <TableContainer id="pairContainer">
                <Box
                  component={Table}
                  alignItems="center"
                  marginBottom="0!important"
                >
                  <TableBody>
                    {tokendata && tokendata.website ? (
                      <TableRow id="cell">
                        <TableCell id="tokenSite">
                          <a
                            id="tokenSiteUrl"
                            target="_blank"
                            href={tokendata.website}
                          >
                            {tokendata.website}
                          </a>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}

                    {tokendata && tokendata.twitter ? (
                      <TableRow id="cell">
                        <TableCell id="tokenTw">
                          <a
                            id="tokenTwUrl"
                            href={tokendata.twitter}
                            target="_blank"
                          >
                            <TwitterIcon />
                          </a>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}
                  </TableBody>
                </Box>
              </TableContainer>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            xl={5}
            component={Box}
            marginBottom="3rem! important"
            classes={{ root: classes.gridItemRoot }}
          >
            <Card
              classes={{
                root: classes.cardRoot,
              }}
              id="leftTable"
            >
              <CardHeader
                id="topTokenGrid"
                subheader={
                  <Grid container component={Box} id="topTokenGridHeader">
                    <ButtonGroup variant="contained" id="topTokenGroup">
                      <Button
                        className="trendButton"
                        onClick={() => setTradeType("trade")}
                      >
                        <img src={trendPng}></img>&nbsp;Trades
                      </Button>
                      <Button
                        className="holderButton"
                        onClick={() => setTradeType("holder")}
                      >
                        <img src={holderPng}></img>&nbsp;Holders
                      </Button>
                    </ButtonGroup>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <TableContainer id="traContainer">
                <Box
                  component={Table}
                  alignItems="center"
                  marginBottom="0!important"
                >
                  <TableHead id="tabelheader">
                    {tradeType === "trade" ? (
                      <TableRow>
                        <TableCell class="tablecell">TIME</TableCell>
                        <TableCell class="tablecell">TRADE</TableCell>
                        <TableCell class="tablecell">TOKEN PRICE</TableCell>
                        <TableCell class="tablecell">BUY/SELL</TableCell>
                        <TableCell class="tablecell">TX</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell class="tablecell">AMOUNT</TableCell>
                        <TableCell class="tablecell">PERCENTAGE</TableCell>
                        <TableCell class="tablecell">ADDRESS</TableCell>
                      </TableRow>
                    )}
                  </TableHead>
                  {tradeType === "trade" ? (
                    <TableBody>
                      {!transactiondata
                        ? ""
                        : transactiondata.map((tra, index) =>
                            tra.base ? (
                              <TableRow id="tbcell2" key={index}>
                                <TableCell id="buy_sell">
                                  <img
                                    id="buy_sell_img"
                                    src={
                                      tra.base.typeSwap == "from" ? Sell : Buy
                                    }
                                  />{" "}
                                  {differenceInMinutes(tra.updatedAt)}m ago
                                </TableCell>
                                <TableCell>
                                  {tra.volume.toFixed(3)}{" "}
                                  <span className="lighTableCellark">
                                    {tra.base.symbol}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {(tra.volumeUSD / tra.volume).toFixed(5)}{" "}
                                  <span className="lighTableCellark">USD</span>
                                </TableCell>
                                <TableCell>
                                  {tra.volumeUSD.toFixed(3)}{" "}
                                  <span className="lighTableCellark">
                                    {tra.quote.symbol}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {" "}
                                  <span>
                                    <a
                                      id="dex"
                                      target="_blank"
                                      href={
                                        "https://solscan.io/tx/" + tra.txHash
                                      }
                                    >
                                      <OpenInNewIcon id="openNew" />
                                    </a>
                                  </span>
                                </TableCell>
                              </TableRow>
                            ) : (
                              ""
                            )
                          )}
                    </TableBody>
                  ) : (
                    <TableBody>
                      {!holderData
                        ? ""
                        : holderData.map((tra, index) => (
                            <TableRow id="tbcell2" key={index}>
                              {console.log(tra, tokendata.supply, "tra")}
                              <TableCell>
                                {tra.amount / 10 ** tra.decimals}
                              </TableCell>
                              <TableCell>
                                {tokendata.supply
                                  ? (
                                      (tra.amount * 100) /
                                      10 ** tra.decimals /
                                      tokendata.supply
                                    ).toFixed(2) + "%"
                                  : "--"}
                              </TableCell>
                              <TableCell>
                                <span>
                                  <a
                                    id="openNew"
                                    target="_blank"
                                    href={`https://solscan.io/account/${tra.address}`}
                                  >
                                    {tra.address}
                                  </a>
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  )}
                </Box>
              </TableContainer>
              {tradeType === "trade" ? (
                <Grid id="traMore">
                  <Button
                    id="traMoreBtn"
                    onClick={() => {
                      getMoreTransaction();
                    }}
                  >
                    Load More
                  </Button>
                </Grid>
              ) : (
                ""
              )}
            </Card>
          </Grid>
          <Grid item xs={12} xl={5}>
            <Card classes={{ root: classes.cardRoot }}>
              <CardHeader
                id="topTokenGrid"
                subheader={
                  <Grid
                    container
                    component={Box}
                    alignItems="center"
                    id="topTokenGridHeader"
                  >
                    <ButtonGroup variant="contained" id="topTokenGroup">
                      <Button
                        className="promotedButton"
                        onClick={() => setTopTokenType("promoted")}
                      >
                        <img className="topTokenBtnImg" src={promotedPng}></img>
                        &nbsp;Promoted
                      </Button>
                      <Button
                        className="gainerButton"
                        onClick={() => setTopTokenType("gainer")}
                      >
                        <img className="topTokenBtnImg" src={gainerdPng}></img>
                        &nbsp;Biggest Gainers
                      </Button>
                      <Button
                        className="loserButton"
                        onClick={() => setTopTokenType("loser")}
                      >
                        <img className="topTokenBtnImg" src={loserPng}></img>
                        &nbsp;Losers
                      </Button>
                    </ButtonGroup>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <TableContainer>
                <Box
                  component={Table}
                  alignItems="center"
                  marginBottom="0!important"
                >
                  {topTokenType === "promoted" ? (
                    <TableBody>
                      <TableRow id="topCell">
                        <TableCell id="promoted" className="promotedHeader">
                          Promoted
                        </TableCell>
                        <TableCell className="promotedHeader">Price</TableCell>
                        <TableCell className="promotedHeader">
                          Total Holders
                        </TableCell>
                        <TableCell className="promotedHeader">24H %</TableCell>
                        <TableCell className="promotedHeader">
                          24H Volume
                        </TableCell>
                      </TableRow>
                      {!promotedData
                        ? ""
                        : promotedData.map((item, key) => (
                            <TableRow id="topCell" key={key}>
                              <TableCell id="promoted">
                                <a
                                  id="promted_address"
                                  onClick={(e) => {
                                    promotedToken(item.mintAddress);
                                  }}
                                >
                                  <img id="promoted_img" src={item.icon}></img>
                                  &nbsp;{item.tokenName}
                                </a>
                              </TableCell>
                              <TableCell>{item.priceUst}</TableCell>
                              <TableCell>{item.holder}</TableCell>
                              <TableCell>{item.changeprice}%</TableCell>
                              <TableCell>{item.hvolum}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  ) : topTokenType === "gainer" ? (
                    <TableBody>
                      <TableRow id="topCell">
                        <TableCell id="gainerName" className="promotedHeader">
                          Token
                        </TableCell>
                        <TableCell className="promotedHeader">Price</TableCell>
                        <TableCell className="promotedHeader">24H %</TableCell>
                      </TableRow>
                      {!gainerData
                        ? ""
                        : gainerData.map((item, key) => (
                            <TableRow id="topCell" key={key}>
                              <TableCell
                                id="gainerName"
                                onClick={() => promotedToken(item.mintAddress)}
                              >
                                <img id="gainerImg" src={item.icon}></img>&nbsp;
                                {item.tokenSymbol ? item.tokenSymbol : ""}
                              </TableCell>
                              <TableCell>
                                {item.priceUst ? "$" + item.priceUst : ""}
                              </TableCell>
                              <TableCell>
                                {item.coingeckoInfo &&
                                item.coingeckoInfo.marketData
                                  ? item.coingeckoInfo.marketData.priceChangePercentage24h.toFixed(
                                      2
                                    ) + "%"
                                  : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow id="topCell">
                        <TableCell id="gainerName" className="promotedHeader">
                          Token
                        </TableCell>
                        <TableCell className="promotedHeader">Price</TableCell>
                        <TableCell className="promotedHeader">24H %</TableCell>
                      </TableRow>
                      {!loserData
                        ? ""
                        : loserData.map((item, key) => (
                            <TableRow id="topCell" key={key}>
                              <TableCell
                                id="gainerName"
                                onClick={() => promotedToken(item.mintAddress)}
                              >
                                <img id="gainerImg" src={item.icon}></img>&nbsp;
                                {item.tokenSymbol ? item.tokenSymbol : ""}
                              </TableCell>
                              <TableCell>
                                {item.priceUst ? "$" + item.priceUst : ""}
                              </TableCell>
                              <TableCell>
                                {item.coingeckoInfo &&
                                item.coingeckoInfo.marketData
                                  ? item.coingeckoInfo.marketData.priceChangePercentage24h.toFixed(
                                      2
                                    ) + "%"
                                  : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  )}
                </Box>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ChartView;
