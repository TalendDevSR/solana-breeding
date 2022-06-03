import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import "layouts/NftChecker.css"
import Sidebar from "components/Sidebar/Sidebar.js";
import Button from "@material-ui/core/Button";
import NavbarDropdown from "components/Dropdowns/NavbarDropdown.js";
import routes from "routes.js";
import componentStyles from "assets/theme/layouts/admin.js";
import Grid from "@material-ui/core/Grid";
import config from "config/index.js"
import "assets/css/layouts/LaunchpadLayout.scss"
import TelegramIcon from '@material-ui/icons/Telegram';
import axios from "axios"
import TwitterIcon from '@material-ui/icons/Twitter';
import DiscordIcon from "assets/img/icons/discord.png";
import MediumIcon from "assets/img/icons/medium.svg"
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles(componentStyles);
const StakingLayout = () => {
    const classes = useStyles();
    const location = useLocation();
    const [type, setType] = useState('upcoming');
    const [upcomingCnt, setUpcomingCnt] = useState(0);
    const [endedCnt, setEndedCnt] = useState(0);
    const [upcomingData, setUpcomingData] = useState([]);
    const [endData, setEndData] = useState([]);
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [location]);

    const getIdoData = async () => {
        let baseurl = config.serverUrl + '/launch/upcome';
        await axios.get(baseurl).then((response) => {
            if (response.data.data) {
                setUpcomingData(response.data.data)
                setUpcomingCnt(response.data.data.length)
            }
        })
        let url = config.serverUrl + '/launch/endData';
        await axios.get(url).then((response) => {
            if (response.data.data) {
                setEndData(response.data.data)
                setEndedCnt(response.data.data.length)
            }
        })
    }

    const getPeriod = (start, end, item) => {
        let startTime = (new Date(start)).getTime();
        let endTime = (new Date(end)).getTime();
        let nowTime = (new Date()).getTime();
        console.log(startTime, endTime, nowTime, "time")
        console.log(start, end, new Date(), "start")
        if (item.status === 'live') {
            let period = (endTime / 1000 - nowTime / 1000);
            let days = Math.trunc((period / 24 / 60 / 60))
            let hours = Math.trunc(((period - (days * 24 * 60 * 60)) / 60 / 60))
            let minutes = Math.trunc(((period - (days * 24 * 60 * 60) - (hours * 60 * 60)) / 60))
            let timeData = days + ' days ' + hours + ' hours ' + minutes + ' minutes ';
            return { type: 1, data: timeData };
        }
        else if (item.status === 'upcoming') {
            let period = (startTime / 1000 - nowTime / 1000);
            let days = Math.trunc((period / 24 / 60 / 60))
            let hours = Math.trunc(((period - (days * 24 * 60 * 60)) / 60 / 60))
            let minutes = Math.trunc(((period - (days * 24 * 60 * 60) - (hours * 60 * 60)) / 60))
            let timeData = days + ' days ' + hours + ' hours ' + minutes + ' minutes ';
            return { type: 2, data: timeData };
        }
        else {
            let period = (nowTime / 1000 - endTime / 1000);
            let days = Math.trunc((period / 24 / 60 / 60))
            let hours = Math.trunc(((period - (days * 24 * 60 * 60)) / 60 / 60))
            let minutes = Math.trunc(((period - (days * 24 * 60 * 60) - (hours * 60 * 60)) / 60))
            let timeData = days + ' days ' + hours + ' hours ' + minutes + ' minutes ';
            return { type: 3, data: timeData };
        }

    }

    const getTime = (date) => {
        let dateTime = new Date(date);
        let dateFormat = dateTime.getFullYear() + '.' + (dateTime.getMonth() + 1) + '.' + dateTime.getDate() + ' ' +
            dateTime.getHours() + ':' + dateTime.getMinutes();
        return dateFormat;
    }

    useEffect(() => {
        getIdoData()
    }, [])

    return (
        <>
            <>
                <Sidebar
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
                    }
                />
                <Box position="relative" className={classes.mainContent}>
                    <Grid id="Launchcontainer">
                        <Grid container>
                            <Grid item xs={2} xl={4}></Grid>
                            <Grid id="typeBtnGroup" item xs={8} xl={4}>
                                <Button className="typeBtn" onClick={() => setType('upcoming')}>upcoming({upcomingCnt})</Button>
                                <Button className="typeBtn" onClick={() => setType('ended')}>ended({endedCnt})</Button>
                            </Grid>
                            <Grid item xs={2} xl={4}></Grid>
                        </Grid>
                        <Grid>
                            <Grid container id="title">
                                {type === 'upcoming' ? 'Upcoming IDOs' : 'Ended IDOs'}
                            </Grid>
                        </Grid>
                        {type === 'upcoming' ?
                            <Grid container id="idoGroup">
                                {
                                    (!upcomingData) ? '' : (
                                        upcomingData.map((item, key) => (
                                            <Grid key={key} container item xl={4} id="ido">
                                                <a id="idoLink" href={`/LaunchpadDetail?id=${item.id}`} target="_blank">
                                                    <Grid container item xl={12} xs={12} id="idoItem">
                                                        <Grid container xs={12} xl={12} id="idoTitle">
                                                            <Grid item xs={8} xl={8} id="projectNameGrid">
                                                                <Grid item id="projectName">
                                                                    {item.projectName}
                                                                </Grid>
                                                                <Grid item id="tokenName">
                                                                    {item.tokenName}
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={4} xl={4} id="projectLogoGrid">
                                                                <img id="projectLogo" src={item.projectImg}></img>
                                                                <img id="blockchainLogo" src={item.blockchainImg}></img>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="iconGroup">
                                                            {
                                                                item.telegram ?
                                                                    <a href={item.telegram} target="_blank"><TelegramIcon className="icons" />
                                                                    </a> : ''
                                                            }
                                                            {
                                                                item.discord ? <a href={item.discord} target="_blank">
                                                                    <img src={DiscordIcon} className="icon"></img>
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.twitter ? <a href={item.twitter} target="_blank">
                                                                    <TwitterIcon className="icons" />
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.medium ? <a href={item.medium} target="_blank">
                                                                    <img src={MediumIcon} className="icon"></img>
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.website ? <a href={item.website} target="_blank">
                                                                    <LanguageIcon className="icons" />
                                                                </a> : ''
                                                            }

                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="statusGroup">
                                                            {item.status === 'ended' ?
                                                                <Box id="endIcon">{item.status}</Box> :
                                                                <Box id="liveIcon">{item.status}</Box>
                                                            }
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="detailGroup">
                                                            <Grid container xs={12} xl={12} id="detailText">
                                                                {item.detailText}
                                                            </Grid>
                                                            <Grid container xs={12} xl={12} id="detailImg">
                                                                {item.detailPhoto ?
                                                                    <img src={item.detailPhoto} id="detailImgChip"></img>
                                                                    : ''
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="startDateGroup">
                                                            <Grid item id="startDate">
                                                                Starts:
                                                            </Grid>
                                                            <Grid item id="startday">
                                                                {getTime(item.startDate)}
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="endDateGroup">
                                                            <Grid id="endDate" xs={10} xl={10} item>
                                                                {
                                                                    (getPeriod(item.startDate, item.endDate, item)).type === 1 ?
                                                                        (
                                                                            (
                                                                                "registration closes in " + (getPeriod(item.startDate, item.endDate, item)).data
                                                                            )
                                                                        )
                                                                        :
                                                                        (getPeriod(item.startDate, item.endDate, item)).type === 2 ?
                                                                            (
                                                                                "registration opens in " + (getPeriod(item.startDate, item.endDate, item)).data
                                                                            )
                                                                            :
                                                                            ("finished " + (getPeriod(item.startDate, item.endDate, item)).data + " ago")
                                                                }
                                                            </Grid>
                                                            <Grid item id="percent" xs={2} xl={2}>
                                                                {item.slider}%
                                                            </Grid>
                                                            <Grid item id="slider" xs={12} xl={12}>
                                                                <input type="range" id="cowbell" name="cowbell"
                                                                    min="0" max="100" value={item.slider} step="10" />
                                                            </Grid>
                                                            <Grid item id="price" xs={12} xl={12}>
                                                                <Box id="nowPrice">{(item.totalAmount * Number(item.slider) / 100).toFixed(0)}&nbsp;USDC</Box>
                                                                <Box id="totalUsdc">{(item.totalAmount * Number(item.slider) / 100).toFixed(0)}/{item.totalAmount}</Box>
                                                            </Grid>
                                                            <Grid item id="tokenPrices" xs={12} xl={12}>
                                                                <Box id="pricetitle">Price:</Box>
                                                                <Box id="priceval">1&nbsp;{item.tokenName}={item.price}</Box>
                                                            </Grid>
                                                            <Grid item id="raise" xs={12} xl={12}>
                                                                <Box id="raisetitle">Total raise:</Box>
                                                                <Box id="totalRaise">
                                                                    ${item.totalAmount}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </a>
                                            </Grid>
                                        )
                                        )
                                    )
                                }
                            </Grid>
                            : <Grid container id="idoGroup">
                                {
                                    (!endData) ? '' : (
                                        endData.map((item, key) => (
                                            <Grid key={key} container item xl={4} id="ido">
                                                <a id="idoLink" href={`/LaunchpadDetail?id=${item.id}`} target="_blank">
                                                    <Grid container item xl={12} xs={12} id="idoItem">
                                                        <Grid container xs={12} xl={12} id="idoTitle">
                                                            <Grid item xs={8} xl={8} id="projectNameGrid">
                                                                <Grid item id="projectName">
                                                                    {item.projectName}
                                                                </Grid>
                                                                <Grid item id="tokenName">
                                                                    {item.tokenName}
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={4} xl={4} id="projectLogoGrid">
                                                                <img id="projectLogo" src={item.projectImg}></img>
                                                                <img id="blockchainLogo" src={item.blockchainImg}></img>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="iconGroup">
                                                            {
                                                                item.telegram ?
                                                                    <a href={item.telegram} target="_blank"><TelegramIcon className="icons" />
                                                                    </a> : ''
                                                            }
                                                            {
                                                                item.discord ? <a href={item.discord} target="_blank">
                                                                    <img src={DiscordIcon} className="icon"></img>
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.twitter ? <a href={item.twitter} target="_blank">
                                                                    <TwitterIcon className="icons" />
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.medium ? <a href={item.medium} target="_blank">
                                                                    <img src={MediumIcon} className="icon"></img>
                                                                </a> : ''
                                                            }
                                                            {
                                                                item.website ? <a href={item.website} target="_blank">
                                                                    <LanguageIcon className="icons" />
                                                                </a> : ''
                                                            }

                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="statusGroup">
                                                            {item.status === 'ended' ?
                                                                <Box id="endIcon">{item.status}</Box> :
                                                                <Box id="liveIcon">{item.status}</Box>
                                                            }
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="detailGroup">
                                                            <Grid container xs={12} xl={12} id="detailText">
                                                                {item.detailText}
                                                            </Grid>
                                                            <Grid container xs={12} xl={12} id="detailImg">
                                                                {item.detailPhoto ?
                                                                    <img src={item.detailPhoto} id="detailImgChip"></img>
                                                                    : ''
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="startDateGroup">
                                                            <Grid item id="startDate">
                                                                Starts:
                                                            </Grid>
                                                            <Grid item id="startday">
                                                                {getTime(item.startDate)}
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container xs={12} xl={12} id="endDateGroup">
                                                            <Grid id="endDate" xs={10} xl={10} item>
                                                                {
                                                                    (getPeriod(item.startDate, item.endDate, item)).type === 1 ?
                                                                        (
                                                                            (
                                                                                "registration closes in " + (getPeriod(item.startDate, item.endDate, item)).data
                                                                            )
                                                                        )
                                                                        :
                                                                        (getPeriod(item.startDate, item.endDate, item)).type === 2 ?
                                                                            (
                                                                                "registration opens in " + (getPeriod(item.startDate, item.endDate, item)).data
                                                                            )
                                                                            :
                                                                            ("finished " + (getPeriod(item.startDate, item.endDate, item)).data + " ago")
                                                                }
                                                            </Grid>
                                                            <Grid item id="percent" xs={2} xl={2}>
                                                                {item.slider}%
                                                            </Grid>
                                                            <Grid item id="slider" xs={12} xl={12}>
                                                                <input type="range" id="cowbell" name="cowbell"
                                                                    min="0" max="100" value={item.slider} step="10" />
                                                            </Grid>
                                                            <Grid item id="price" xs={12} xl={12}>
                                                                <Box id="nowPrice">{(item.totalAmount * Number(item.slider) / 100).toFixed(0)}USDC</Box>
                                                                <Box id="totalUsdc">{(item.totalAmount * Number(item.slider) / 100).toFixed(0)}/{item.totalAmount }</Box>
                                                            </Grid>
                                                            <Grid item id="tokenPrices" xs={12} xl={12}>
                                                                <Box>price:</Box>
                                                                <Box>1{item.tokenName}={item.price}</Box>
                                                            </Grid>
                                                            <Grid item id="raise" xs={12} xl={12}>
                                                                <Box>total raise:</Box>
                                                                <Box id="totalRaise">
                                                                    ${item.totalAmount}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </a>
                                            </Grid>
                                        )
                                        )
                                    )
                                }
                            </Grid>
                        }
                    </Grid>
                </Box>
            </>
        </>
    );
};

export default StakingLayout;
