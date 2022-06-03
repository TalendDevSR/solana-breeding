import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import Sidebar from "components/Sidebar/Sidebar.js";
import Button from "@material-ui/core/Button";
import NavbarDropdown from "components/Dropdowns/NavbarDropdown.js";
import routes from "routes.js";
import componentStyles from "assets/theme/layouts/admin.js";
import Grid from "@material-ui/core/Grid";
import config from "config/index.js"
import axios from "axios"
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import DiscordIcon from "assets/img/icons/discord.png";
import MediumIcon from "assets/img/icons/medium.svg"
import idl from '../json/idl.json';
import poolPublic from '../json/pool.json';
import { useSelector } from "react-redux";
import LanguageIcon from '@material-ui/icons/Language';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import "layouts/NftChecker.css"
import "assets/css/layouts/LaunchpadDetailLayout.scss"

import {
    useWallet,
    useConnection
} from '@solana/wallet-adapter-react';

const { SystemProgram, Keypair, SYSVAR_CLOCK_PUBKEY } = web3;
const programID = new PublicKey("E4VP5CqmKCy7HLzCyZg3FaKLoCE5M9nLhyZLWPMjeeQ6");
const poolKeys = new PublicKey(new Uint8Array(poolPublic));
const opts = {
    preflightCommitment: "processed"
}
const useStyles = makeStyles(componentStyles);
const LaunchpadDetail = () => {
    const address = useSelector((store) => store.provider.address);
    const classes = useStyles();
    const location = useLocation();
    const [transferAmt, setTransferAmt] = useState(0);
    const [data, setData] = useState();
    const [usdcBal, setUsdcBal] = useState(0);
    const [level, setLevel] = useState(7);
    const decimals = 10 ** 6;
    const { signTransaction } = useWallet();
    const [stakedAmt, setStakedAmt] = useState(0);
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [location]);

    const { connection } = useConnection();
    const wallet = useWallet();

    const getProvider = async () => {
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment,
        );
        return provider;
    }
    const getIdoDetail = async (id) => {
        let baseurl = config.serverUrl + '/launch/detail';
        await axios.post(baseurl, { id: id }).then((response) => {
            if (response.data.data) {
                console.log(response.data.data, "data")
                setData(response.data.data[0])
            }
        })
    }
    const getHistory = async () => {
        let url_para = window.location.href;
        let url_para_data = new URL(url_para);
        let url_para_address = url_para_data.searchParams.get("id");
        let baseurl = config.serverUrl + '/ido/checkData';
        let historyData = await axios.post(baseurl, { id: url_para_address, address: wallet.publicKey.toBase58() });
        return historyData.data.result; 
    }

    const bulkTransfer = async (tokenMintAddress, wallet, to, connection, amounts) => {
        const mintPublicKey = new web3.PublicKey(tokenMintAddress);
        const mintToken = new Token(
            connection,
            mintPublicKey,
            TOKEN_PROGRAM_ID,
            wallet
        );
        const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
            wallet.publicKey
        );
        let instructions = [];
        const dest = to[0];
        const destPublicKey = new web3.PublicKey(dest);
        const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
            mintToken.associatedProgramId,
            mintToken.programId,
            mintPublicKey,
            destPublicKey
        );

        const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
        if (receiverAccount === null) {
            instructions.push(
                Token.createAssociatedTokenAccountInstruction(
                    mintToken.associatedProgramId,
                    mintToken.programId,
                    mintPublicKey,
                    associatedDestinationTokenAddr,
                    destPublicKey,
                    wallet.publicKey
                )
            )
        }
        instructions.push(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                associatedDestinationTokenAddr,
                wallet.publicKey,
                [],
                amounts * decimals
            )
        );

        const transaction = new web3.Transaction().add(...instructions);
        const blockHash = await connection.getRecentBlockhash()
        transaction.feePayer = await wallet.publicKey;
        transaction.recentBlockhash = await blockHash.blockhash
        const signed = await signTransaction(transaction)
        try {
            const signature = await connection.sendRawTransaction(signed.serialize())
            console.log(signature, "transactionhash")
            const tx = await connection.confirmTransaction(signature)
            getTokenBalance(new PublicKey(config.USDC_TOKEN_ADDRESS));
            let url_para = window.location.href;
            let url_para_data = new URL(url_para);
            let url_para_address = url_para_data.searchParams.get("id");
            let baseurl = config.serverUrl + '/ido/create';
            let result = await axios.post(baseurl, { id: url_para_address, address: wallet.publicKey.toBase58(), amount: transferAmt, status: 'progress', tokenPrice: data.price, tokenAmount: transferAmt / data.price, tokenName: data.tokenName, projectName: data.projectName, txHash: signature })
            console.log(result)
        } catch (e) {
            console.log(e)
        }
    }

    const transfer = async () => {
        const tokenMintAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        const adminWallet = new web3.PublicKey('9BqViyehpiQjn1ZHDcJt321JRBVxJj9ouCKjfLmMGrtX');
        const mainWalletTokens = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: new web3.PublicKey(tokenMintAddress) });
        if (transferAmt == 0) {
            alert("Amount is 0!");
            return;
        }
        if (data.status !== 'live') {
            alert("you can't buy because status is not live")
            return;
        }
        if (mainWalletTokens.value.length == 0) {
            alert("Token does not exists in your wallet");
            return;
        }

        else {
            const token = mainWalletTokens.value.pop();
            const value = (await connection.getTokenAccountBalance(token.pubkey)).value;
            const totalAmt = (level !== 7) ? data[`level${level}`] : 0;
            console.log(totalAmt, "total")
            console.log(value.uiAmount, "rea")
            if (transferAmt > value.uiAmount) {
                alert("Token amount is less than what you want to send amount.");
                return;
            }
            else if (transferAmt > totalAmt) {
                alert("Max allocation is less than what you want to send amount.");
                return;
            }
        }
        const historyData = await getHistory();

        if (historyData === 'success') {
            alert("You have already bought.");
            return;
        }
        const destAddres = [
            adminWallet.toBase58()
        ];
        try {
            await bulkTransfer(tokenMintAddress, wallet, destAddres, connection, transferAmt);
        } catch (e) {
            console.log(e)
        }
        const destTokens = await connection.getTokenAccountsByOwner(adminWallet, { mint: new web3.PublicKey(tokenMintAddress) });
        if (destTokens.value.length == 0) {
            console.log("Balance: 0");
        }
        else {
            const token = destTokens.value.pop();
            const balance = (await connection.getTokenAccountBalance(token.pubkey)).value.uiAmount;
        }
    }

    const getStakedBalance = async () => {
        const provider = await getProvider()
        const program = new Program(idl, programID, provider);
        try {
            const [
                _userPubkey, _userNonce,
            ] = await PublicKey.findProgramAddress(
                [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
                programID
            );
            const accountData = await program.account.user.fetch(_userPubkey);
            let stakedAmt = (accountData.balanceStakedA.toNumber() + accountData.balanceStakedB.toNumber() + accountData.balanceStakedC.toNumber()) / (10 ** 6);
            setStakedAmt(stakedAmt)
            return stakedAmt;
        } catch (e) {
            console.log(e.message)
            return 0;
        }
    }

    const getTokenBalance = async (pubkey) => {
        if (!wallet.publicKey) {
            return 0;
        }
        const provider = await getProvider();
        const tokens = await provider.connection.getTokenAccountsByOwner(wallet.publicKey, { mint: pubkey });

        if (tokens.value.length == 0) {
            return 0;
        }
        const token = tokens.value.pop();
        const val = (await provider.connection.getTokenAccountBalance(token.pubkey)).value;
        const balance = val.uiAmount;
        setUsdcBal(balance)
        return parseFloat(balance.toFixed(6));
    }

    const getPeriod = (start, end, item) => {
        let startTime = (new Date(start)).getTime();
        let endTime = (new Date(end)).getTime();
        let nowTime = (new Date()).getTime();
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
        console.log(dateTime, "time")
        let dateFormat = dateTime.getFullYear() + '.' + (dateTime.getMonth() + 1) + '.' + dateTime.getDate() + ' ' +
            dateTime.getHours() + ':' + dateTime.getMinutes();
        return dateFormat;
    }

    useEffect(() => {
        let url_para = window.location.href;
        let url_para_data = new URL(url_para);
        let url_para_address = url_para_data.searchParams.get("id");
        getIdoDetail(url_para_address)
    }, [])

    useEffect(async () => {
        if (address) {
            getTokenBalance(new PublicKey(config.USDC_TOKEN_ADDRESS));
            const stakedBalance = await getStakedBalance();
            const historyData = await getHistory();
            console.log(historyData, "wehn")
            if (historyData === 'success') {
                setLevel(7);
            }
            else {
                console.log(stakedBalance >= 0, "sfsldfjsdflkj")
                if (stakedBalance >= 0 && stakedBalance <= 4999) {
                    setLevel(0);
                    console.log("hereeee")
                }
                else if (stakedBalance >= 5000 && stakedBalance <= 9999) {
                    console.log("level")
                    setLevel(1);
                }
                else if (stakedBalance >= 10000 && stakedBalance <= 19999) {
                    setLevel(2);
                }
                else if (stakedBalance >= 20000 && stakedBalance <= 49999) {
                    setLevel(3);
                }
                else if (stakedBalance >= 50000 && stakedBalance <= 99999) {
                    setLevel(4);
                }
                else if (stakedBalance >= 100000 && stakedBalance <= 249999) {
                    setLevel(5);
                }
                else if (stakedBalance >= 250000) {
                    setLevel(6);
                }
                else {
                    setLevel(7);
                }
            }
        }
    }, [address])

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
                <Box position="relative" id="launch" className={classes.mainContent}>
                    {data ?
                        <Grid id="LaunchDetailcontainer">
                            <Grid container id="title">
                                <Grid item xs={12} xl={8} id="projectLogoGrid">
                                    <Grid item container xs={3} xl={3} id="logoGrid">
                                        <img src={data.projectImg} id="projectLogo"></img>
                                        <img src={data.blockchainImg} id="blockchainLogo"></img>
                                    </Grid>
                                    <Grid item container xs={9} xl={9}>
                                        <Grid item xs={12} xl={12} id="projectName">
                                            {data.projectName}
                                        </Grid>
                                        <Grid item id="tokenName" xs={12} xl={12}>
                                            {data.tokenName}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} xl={4} id="walletConnect">
                                    <WalletMultiButton id="walletConnect" />
                                </Grid>
                            </Grid>
                            <Grid container id="status">
                                {data.status === 'ended' ?
                                    <Box id="endIcon">{data.status}</Box> :
                                    <Box id="liveIcon">{data.status}</Box>
                                }
                            </Grid>
                            <Grid container id="socialGrid">
                                <Grid item xs={12} xl={6} id="socialLink">
                                    {
                                        data.telegram ?
                                            <a href={data.telegram} target="_blank"><TelegramIcon className="icons" />
                                            </a> : ''
                                    }
                                    {
                                        data.discord ? <a href={data.discord} target="_blank">
                                            <img src={DiscordIcon} className="icon"></img>
                                        </a> : ''
                                    }
                                    {
                                        data.twitter ? <a href={data.twitter} target="_blank">
                                            <TwitterIcon className="icons" />
                                        </a> : ''
                                    }
                                    {
                                        data.medium ? <a href={data.medium} target="_blank">
                                            <img src={MediumIcon} className="icon"></img>
                                        </a> : ''
                                    }
                                    {
                                        data.website ? <a href={data.website} target="_blank">
                                            <LanguageIcon className="icons" />
                                        </a> : ''
                                    }
                                </Grid>
                                <Grid item xs={12} xl={6}></Grid>
                            </Grid>
                            <Grid container id="detailText">
                                {data.detailText}
                            </Grid>
                            {data.detailPhoto ?
                                <Grid container id="detailImgGrid">
                                    <img src={data.detailPhoto} id="detailImg"></img>
                                </Grid> : ''
                            }
                            <Grid container id="dataSection">
                                <Grid container xs={12} xl={6} id="dataGrid">
                                    <Grid xs={12} xl={12} id="startDate">
                                        <Grid item id="startTitle">Starts:</Grid>
                                        <Grid item id="startday">
                                            {getTime(data.startDate)}
                                        </Grid>
                                    </Grid>
                                    <Grid id="endDate" xs={10} xl={10} item>
                                        {
                                            (getPeriod(data.startDate, data.endDate, data)).type === 1 ?
                                                (
                                                    (
                                                        "registration closes in " + (getPeriod(data.startDate, data.endDate, data)).data
                                                    )
                                                )
                                                :
                                                (getPeriod(data.startDate, data.endDate, data)).type === 2 ?
                                                    (
                                                        "registration opens in " + (getPeriod(data.startDate, data.endDate, data)).data
                                                    )
                                                    :
                                                    ("finished " + (getPeriod(data.startDate, data.endDate, data)).data + " ago")
                                        }
                                    </Grid>
                                    <Grid item id="percent" xs={2} xl={2}>
                                        {data.slider}%
                                    </Grid>
                                    <Grid item id="slider" xs={12} xl={12}>
                                        <input type="range" id="cowbell" name="cowbell"
                                            min="0" max="100" value={data.slider} step="10" />
                                    </Grid>
                                    <Grid item id="price" xs={12} xl={12}>
                                        <Box id="nowPrice">{(data.totalAmount * Number(data.slider) / 100).toFixed(0)}&nbsp;USDC</Box>
                                        <Box id="totalUsdc">{(data.totalAmount * Number(data.slider) / 100).toFixed(0)}/{data.totalAmount}</Box>
                                    </Grid>
                                    <Grid item id="tokenPriceInfo" xs={12} xl={6}>
                                        <Box id="priceTitle">Price:&nbsp;</Box>
                                        <Box>1&nbsp;{data.tokenName}={data.price}</Box>
                                    </Grid>

                                    <Grid item id="raise" xs={12} xl={6}>
                                        <Box id="raiseTitle">Total raise:&nbsp;</Box>
                                        <Box id="totalRaise">
                                            ${data.totalAmount}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid container xs={12} xl={6} id="transferGrid">
                                    <Grid item xs={12} xl={12} id="allocationGrid">
                                        <Box className="allocationTitle">Max Allocation:</Box>
                                        {console.log(data[`level${level}`], level, "levelt")}
                                        <Box className="allocation">{level != 7 ? data[`level${level}`] : 0}&nbsp;USDC</Box>
                                    </Grid>
                                    <Grid item xs={12} xl={12} id="balanceGrid">
                                        <Box className="balanceTitle">Your Balance:</Box>
                                        <Box className="balance">{(usdcBal != 0 ? usdcBal.toFixed(4) : 0)}&nbsp;USDC</Box>
                                    </Grid>
                                    <Grid item id="staked" xs={12} xl={12}>
                                        <Box id="stakedTitle">Your Staked Amount:</Box>
                                        <Box id="stakedamount">{stakedAmt}&nbsp;$SOLV</Box>
                                    </Grid>
                                    <Grid item xs={12} xl={12} id="transfer">
                                        <Grid item id="amountGrid" xs={12} xl={6}>
                                            <input type="text" value={transferAmt} onChange={(e) => setTransferAmt(e.target.value)} id="amount"></input>
                                        </Grid>
                                        <Grid item id="action" xs={12} xl={6}>
                                            <a id="maxBtn" onClick={(e) => { (level != 7) ? setTransferAmt(data[`level${level}`]) : setTransferAmt(0) }}>MAX</a>
                                            <Button id="sendBtn" onClick={() => transfer()}>Send</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> : ''
                    }
                </Box>
            </>
        </>
    );
};

export default LaunchpadDetail;
