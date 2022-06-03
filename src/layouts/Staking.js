import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import "layouts/NftChecker.css"
import Sidebar from "components/Sidebar/Sidebar.js";
import NavbarDropdown from "components/Dropdowns/NavbarDropdown.js";
import routes from "routes.js";
import componentStyles from "assets/theme/layouts/admin.js";
import Grid from "@material-ui/core/Grid";
import config from "config/index.js"
import { PublicKey } from '@solana/web3.js';
import { Program, Provider,Wallet, web3, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import "assets/css/layouts/StakingLayout.scss"
import { useSelector } from "react-redux";
import idl from '../json/idl.json';
import poolPublic from '../json/pool.json';
import CachedIcon from '@material-ui/icons/Cached';
import axios from "axios"

import {
    useWallet,
    useConnection
} from '@solana/wallet-adapter-react';
require('@solana/wallet-adapter-react-ui/styles.css');

const { SystemProgram, Keypair, SYSVAR_CLOCK_PUBKEY } = web3;
const programID = new PublicKey("E4VP5CqmKCy7HLzCyZg3FaKLoCE5M9nLhyZLWPMjeeQ6");
const poolKeys = new PublicKey(new Uint8Array(poolPublic));
const opts = {
    preflightCommitment: "processed"
}

const useStyles = makeStyles(componentStyles);
const StakingLayout = () => {
    const classes = useStyles();
    const location = useLocation();

    const address = useSelector((store) => store.provider.address);
    const [apyPercent, setApyPercent] = useState(0);
    const [lockPeriod, setLockPeriod] = useState(7);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [location]);
    const [stakeType, setStakeType] = useState(7);
    const [stakedAmountA, setStakedAmountA] = useState(0);
    const [stakedAmountB, setStakedAmountB] = useState(0);
    const [stakedAmountC, setStakedAmountC] = useState(0);
    const [xtagStakeAmount, setXtagStakeAmount] = useState(0);
    const [xtagUnstakeAmount, setXtagUnstakeAmount] = useState(0);
    const [aLock, setALock] = useState(0);
    const [bLock, setBLock] = useState(0);
    const [cLock, setCLock] = useState(0);
    const [aPending, setAPending] = useState(0);
    const [bPending, setBPending] = useState(0);
    const [cPending, setCPending] = useState(0);
    const [totalStackedXTAG, setTotalStackedXTAG] = useState(0.0);
    const [totalUnstakedXTAG, setTotalUnstakedXTAG] = useState(0.0);
    const [earn, setEarn] = useState(0.0);
    const [isUser, setIsUser] = useState(0);
    const [balance, setBalance] = useState(0.0);
    const [rewardAmountA, setRewardAmountA] = useState(0);
    const [rewardAmountB, setRewardAmountB] = useState(0);
    const [rewardAmountC, setRewardAmountC] = useState(0);
    const { connection } = useConnection();
    const wallet = useWallet();
    const keypair = new web3.Keypair();
    console.log(new Wallet(keypair), "keypair")
  
    // const env = 'mainnet-beta';
    // const rpcUrl = web3.clusterApiUrl(env);
    // const connection = new web3.Connection(rpcUrl);

    async function getProvider() {
        const provider = new Provider(
            connection, wallet, opts.preflightCommitment,
        );
        
        return provider;
    }

    async function stake() {
        let amount = parseFloat(xtagStakeAmount);
        if (amount < 1) {
            alert("Minimum Amount is 1 SOLV!");
            return;
        }
        if (isNaN(amount) || amount === 0) {
            alert("Amount is zero.");
            return;
        }

        const maxAmount = await getTokenBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID));
        if (amount > maxAmount) {
            alert("Not enough token amount.");
            return;
        }

        const provider = await getProvider()

        const program = new Program(idl, programID, provider);
        let poolObject = await program.account.pool.fetch(poolKeys);
        const [
            _poolSigner,
            _nonce,
        ] = await PublicKey.findProgramAddress(
            [poolKeys.toBuffer()],
            programID
        );
        let poolSigner = _poolSigner;
        const [
            _userPubkey, _userNonce,
        ] = await PublicKey.findProgramAddress(
            [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
            programID
        );

        try {
            const data = await program.account.user.fetch(_userPubkey);
        } catch (e) {
            console.log(e.message)
            if (e.message == 'Account does not exist ' + _userPubkey.toBase58()) {
                await createStakeAccount();
            }
        }

        try {
            const stakingMintObject = new Token(
                provider.connection,
                new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID),
                TOKEN_PROGRAM_ID,
                provider.wallet.payer);
            const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            const stakingPubkey = stakingAccountInfo.address;
            await program.rpc.stake(
                new BN(amount * (10 ** 6)), new BN(stakeType),
                {
                    accounts: {
                        // Stake instance.
                        pool: poolKeys,
                        stakingVault: poolObject.stakingVault,
                        // User.
                        user: _userPubkey,
                        owner: wallet.publicKey,
                        stakeFromAccount: stakingPubkey,
                        // Program signers.
                        poolSigner,
                        // Misc.
                        clock: SYSVAR_CLOCK_PUBKEY,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    },
                }
            );
            await getStakedBalance();
            getEarned()
        } catch (err) {
            console.log("Transaction error: ", err);
        }
    }

    async function unstake() {
        let amount = parseFloat(xtagUnstakeAmount);
        if (isNaN(amount) || amount === 0) {
            alert("Amount is zero.");
            return;
        }

        const maxAmount = await getStakedBalance();
        if (amount > maxAmount) {
            alert("Not enough token amount.");
            return;
        }

        const provider = await getProvider()

        const program = new Program(idl, programID, provider);
        let poolObject = await program.account.pool.fetch(poolKeys);
        const [
            _poolSigner,
            _nonce,
        ] = await PublicKey.findProgramAddress(
            [poolKeys.toBuffer()],
            programID
        );
        let poolSigner = _poolSigner;

        const [
            _userPubkey, _userNonce,
        ] = await PublicKey.findProgramAddress(
            [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
            programID
        );
        try {
            const stakingMintObject = new Token(
                provider.connection,
                new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID),
                TOKEN_PROGRAM_ID,
                provider.wallet.payer);
            const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            const stakingPubkey = stakingAccountInfo.address;
            await program.rpc.unstake(
                new BN(amount * (10 ** 6)), new BN(stakeType),
                {
                    accounts: {
                        // Stake instance.
                        pool: poolKeys,
                        stakingVault: poolObject.stakingVault,
                        // User.
                        user: _userPubkey,
                        owner: wallet.publicKey,
                        stakeFromAccount: stakingPubkey,
                        // Program signers.
                        poolSigner,
                        // Misc.
                        clock: SYSVAR_CLOCK_PUBKEY,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    },
                });
            getStakedBalance();
            getEarned();

        } catch (err) {
            console.log("Transaction error: ", err);
        }
    }

    async function claim() {
        try {
            const provider = await getProvider()
            const program = new Program(idl, programID, provider);

            let poolObject = await program.account.pool.fetch(poolKeys);

            const stakingMintObject = new Token(
                provider.connection,
                new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID),
                TOKEN_PROGRAM_ID,
                provider.wallet.payer);
            const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
            const stakingPubkey = stakingAccountInfo.address;

            const [
                _poolSigner,
                _nonce,
            ] = await PublicKey.findProgramAddress(
                [poolKeys.toBuffer()],
                programID
            );
            let poolSigner = _poolSigner;

            const [
                userPubkey, _userNonce,
            ] = await PublicKey.findProgramAddress(
                [provider.wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
                programID
            );

            const stakingTokenMint = new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID);
            try {
                await program.rpc.claim(
                    new BN(stakeType),
                    {
                        accounts: {
                            // Stake instance.
                            pool: poolKeys,
                            stakingVault: poolObject.stakingVault,
                            // User.
                            user: userPubkey,
                            owner: provider.wallet.publicKey,
                            rewardAAccount: stakingPubkey,
                            // Program signers.
                            poolSigner,
                            // Misc.
                            tokenProgram: TOKEN_PROGRAM_ID,
                        },
                    });
                getStakedBalance();
                getEarned()
            } catch (e) {
                console.log(e)
            }
        }
        catch (err) {
            console.log(err)
        }

        return await getTokenBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID));
    }

    async function getTokenBalance(pubkey) {
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

        return parseFloat(balance.toFixed(6));
    }

    async function getTotalStakedBalance(pubkey) {
        const provider = await getProvider();

        const [
            _poolSigner,
            _nonce,
        ] = await PublicKey.findProgramAddress(
            [poolKeys.toBuffer()],
            programID
        );
        let poolSigner = _poolSigner;
        const tokens = await provider.connection.getTokenAccountsByOwner(
            poolSigner, { mint: pubkey });
        if (tokens.value.length == 0) {
            return 0;
        }
        const token = tokens.value.pop();
        const balance = (await provider.connection.getTokenAccountBalance(token.pubkey)).value.uiAmount.toFixed(6);
        return parseFloat(balance);
    }

    async function getTotalUnstakedBalance(pubkey) {

        const provider = await getProvider();
        const tokens = await provider.connection.getTokenAccountsByOwner(
            new PublicKey(config.REACT_APP_FUNDER), { mint: pubkey });

        if (tokens.value.length == 0) {
            return 0;
        }
        const token = tokens.value.pop();
        const balance = (await provider.connection.getTokenAccountBalance(token.pubkey)).value.uiAmount.toFixed(6);

        return parseFloat(balance);
    }

    async function getStakedBalance() {
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
            if (accountData) {
                setIsUser(1);
            }
            if ((((new Date().getTime()) / 1000) - (accountData.stakeTimeA.toNumber())) > 7 * 24 * 60 * 60) {
                setALock(0)
                setAPending(0)
            }
            else {
                setAPending(1)
                setALock(1);
            }
            if ((((new Date().getTime()) / 1000) - (accountData.stakeTimeB.toNumber())) > 14 * 24 * 60 * 60) {
                let stakedAmount = (((new Date().getTime()) / 1000) - (accountData.lastUpdateTimeB.toNumber())) * ((accountData.balanceStakedB.toNumber() / (10 ** 6)) * 0.05) / (365 * 24 * 60 * 60);
                if (stakedAmount > 0.00001) {
                    setBLock(0)
                }
                else {
                    setBLock(1)
                }
                setBPending(0);
                setRewardAmountB(stakedAmount)
            }
            else {
                setBPending(1);
                setBLock(1);
            }
            if ((((new Date().getTime()) / 1000) - (accountData.stakeTimeC.toNumber())) > 30 * 24 * 60 * 60) {
                setCLock(0)
                let stakedAmount = (((new Date().getTime()) / 1000) - (accountData.lastUpdateTimeC.toNumber())) * ((accountData.balanceStakedC.toNumber() / (10 ** 6)) * 0.1) / (365 * 24 * 60 * 60)
                if (stakedAmount > 0.00001) {
                    setCLock(0)
                }
                else {
                    setCLock(1)
                }
                setCPending(0)
                setRewardAmountC(stakedAmount)
            }
            else {
                setCPending(1)
                setCLock(1);
            }
            const stakedAAmount =Number((accountData.balanceStakedA.toNumber() / (10 ** 6)).toFixed(4)); 
            const stakedBAmount =Number((accountData.balanceStakedB.toNumber() / (10 ** 6)).toFixed(4)); 
            const stakedCAmount =Number((accountData.balanceStakedC.toNumber() / (10 ** 6)).toFixed(4));
            if(stakedAAmount>(accountData.balanceStakedA.toNumber() / (10 ** 6))){
                setStakedAmountA(stakedAAmount-0.0001);
            }else{
                setStakedAmountA(stakedAAmount);
            } 
            if(stakedBAmount>(accountData.balanceStakedB.toNumber() / (10 ** 6))){
                setStakedAmountB(stakedBAmount-0.0001);
            }else{
                setStakedAmountB(stakedBAmount);
            } 
            if(stakedCAmount>(accountData.balanceStakedC.toNumber() / (10 ** 6))){
                setStakedAmountC(stakedCAmount-0.0001);
            }else{
                setStakedAmountC(stakedCAmount);
            } 
            if (stakeType == 7) {
                if(stakedAAmount>(accountData.balanceStakedA.toNumber() / (10 ** 6))){
                    return(stakedAAmount-0.0001);
                }else{
                    return(stakedAAmount);
                } 
            }
            else if (stakeType == 14) {
                if(stakedBAmount>(accountData.balanceStakedB.toNumber() / (10 ** 6))){
                    return(stakedBAmount-0.0001);
                }else{
                    return(stakedBAmount);
                } 
            }
            else {
                if(stakedCAmount>(accountData.balanceStakedC.toNumber() / (10 ** 6))){
                    return(stakedCAmount-0.0001);
                }else{
                    return(stakedCAmount);
                } 
            }
        } catch (e) {
            setIsUser(0);
            console.log(e.message)
            return 0;
        }
    }

    async function setMaxValue() {
        setXtagStakeAmount(await getTokenBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID)));
    }

    async function setUnstakeMaxValue() {
        setXtagUnstakeAmount(await getStakedBalance());
    }

    async function createStakeAccount() {
        if (address) {
            const provider = await getProvider();
            const program = new Program(idl, programID, provider);
            try {
                const [
                    _userPubkey, _userNonce,
                ] = await PublicKey.findProgramAddress(
                    [provider.wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
                    program.programId
                );
                try {
                    await program.rpc.createUser(_userNonce, {
                        accounts: {
                            pool: poolKeys,
                            user: _userPubkey,
                            owner: provider.wallet.publicKey,
                            systemProgram: SystemProgram.programId,
                        },
                    });
                    await getTokenBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID));
                    let baseurl = config.serverUrl + '/staking/create';
                    await axios.post(baseurl, { account: provider.wallet.publicKey.toBase58() }).then((response) => {
                        console.log(response);
                    })
                } catch (e) {
                    console.log(e, "mess")
                    if (e.message == 'failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.') {
                        alert("You need to charge at least 0.00001 sol");
                    }
                }
            }
            catch {
                alert("You have to connect your wallet")
            }
        }
        else {
            alert("You have to connect your wallet");
        }
    }

    async function getEarned() {
        const provider = await getProvider()
        const program = new Program(idl, programID, provider);
        if (wallet.publicKey === null) {
            return;
        }

        const [
            _userPubkey, _userNonce,
        ] = await PublicKey.findProgramAddress(
            [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
            programID
        );

        try {
            const accountData = await program.account.user.fetch(_userPubkey);
            setBalance(await getTokenBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID)));
            // var val = (accountData.rewardAPerTokenPending.toNumber() / (10**6)).toFixed(6)
            // setEarn(val);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(async () => {
        getStakedBalance();
        const balance = await getTotalStakedBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID));
        setTotalStackedXTAG(balance);
        const ubalance = await getTotalUnstakedBalance(new PublicKey(config.REACT_APP_XTAG_STAKE_TOKEN_ID));
        setTotalUnstakedXTAG(ubalance);
        await getEarned()
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
                <Box position="relative" className={classes.mainContent}>
                    <Box id="staking">
                        <Box id="stakingModal">
                            <Grid container>
                                <Grid item xs={10} xl={10}>
                                    <Box id="stkTitle">Stake for IDO Participation</Box>
                                </Grid>
                                <Grid item id="reloadBtn" xs={2} xl={2}>
                                    <CachedIcon title="Please update latest information" id="reloadIcon" onClick={() => getStakedBalance()} />
                                </Grid>
                            </Grid>
                            {/* <Box id='stkDetBox'><input id="stkDetail" placeholder="Enter Details"></input></Box> */}
                            <Box id='stkBtnGrp'>
                                <Button id="stkDayBtn" onClick={() => { getStakedBalance(); setApyPercent(0); setLockPeriod(7); setStakeType(7); setXtagUnstakeAmount(0) }}>7 Days</Button>
                                <Button id="stkDayBtn" onClick={() => { getStakedBalance(); setApyPercent(5); setLockPeriod(14); setStakeType(14); setXtagUnstakeAmount(0) }}>14 Days</Button>
                                <Button id="stkDayBtn" onClick={() => { getStakedBalance(); setApyPercent(10); setLockPeriod(30); setStakeType(30); setXtagUnstakeAmount(0) }}>30 Days</Button>
                            </Box>
                            <Box id="stkBrBox">
                                <Box id="stkBorder"></Box>
                            </Box>
                            <Box id="stkApy">
                                <Button id="apyBtn">{apyPercent}% APY*</Button>
                            </Box>
                            <Box id="stkOption"><span id="opTitle">Lock period</span><span id="opVal">{lockPeriod} Days</span></Box>
                            <Box id="stkOption"><span id="opTitle">Extends Lock On Registeration</span><span id="opVal">Yes</span></Box>
                            <Box id="stkOption"><span id="opTitle">Early Unstake Fee</span><span id="opVal">25%</span></Box>
                            {stakeType == 7 ?
                                <Box id="stkOption"><span id="opTitle">Status</span><span id="opVal">{aPending == 0 ? 'UnLock' : 'Lock'}</span></Box>
                                : (
                                    stakeType == 14 ?
                                        <Box id="stkOption"><span id="opTitle">Status</span><span id="opVal">{bPending == 0 ? 'UnLock' : 'Lock'}</span></Box> :
                                        <Box id="stkOption"><span id="opTitle">Status</span><span id="opVal">{cPending == 0 ? 'UnLock' : 'Lock'}</span></Box>
                                )
                            }
                            {isUser == 0 ?
                                <Grid containter id="stkMain">
                                    <Grid item id="stkApprove" xs={12} xl={12}>
                                        <Button id="approveBtn" onClick={() => createStakeAccount()}>Create Account</Button>
                                    </Grid>
                                </Grid> : ''
                            }
                            <Grid containter id="stkMain">
                                <Grid item id="stkBalance" container xs={5} xl={5}>
                                    <Grid item id="balance" xs={12} xl={12}>Balance: {balance ? balance.toFixed(4) : 0}&nbsp;SOLV</Grid>
                                    <Grid item id="stkAmtBox" xs={12} xl={12}>
                                        <input id="stkAmount" value={xtagStakeAmount} onChange={e => setXtagStakeAmount(e.target.value)}></input>
                                    </Grid>
                                </Grid>
                                <Grid item id="stkMax" xs={3} xl={3}>
                                    <a id="maxBtn" onClick={e => setMaxValue()}>Max</a>
                                    <span id="solvName">SOLV</span>
                                </Grid>
                                <Grid item id="stkApprove" xs={4} xl={4}>
                                    <Button id="approveBtn" onClick={() => stake()}>Approve</Button>
                                </Grid>
                            </Grid>
                            <Grid containter id="stkMain">
                                <Grid item id="stkBalance" container xs={5} xl={5}>
                                    {
                                        stakeType == 7 ?
                                            <Grid item id="balance" xs={12} xl={12}>Staked: {stakedAmountA}&nbsp;SOLV</Grid> : (
                                                stakeType == 14 ?
                                                    <Grid item id="balance" xs={12} xl={12}>Staked: {stakedAmountB}&nbsp;SOLV</Grid>
                                                    :
                                                    <Grid item id="balance" xs={12} xl={12}>Staked: {stakedAmountC}&nbsp;SOLV</Grid>
                                            )
                                    }
                                    <Grid item id="stkAmtBox" xs={12} xl={12}>
                                        <input id="stkAmount" value={xtagUnstakeAmount} onChange={e => setXtagUnstakeAmount(e.target.value)} ></input>
                                    </Grid>
                                </Grid>
                                <Grid item id="stkMax" xs={3} xl={3}>
                                    <a id="maxBtn" onClick={e => setUnstakeMaxValue()}>Max</a>
                                    <span id="solvName">SOLV</span>
                                </Grid>
                                <Grid item id="stkApprove" xs={4} xl={4}>
                                    <Button id="approveBtn" onClick={(e) => { unstake() }}>Unstake</Button>
                                </Grid>
                            </Grid>
                            {
                                (stakeType != 7) ?
                                    stakeType == 14 ?
                                        bLock == 0 ?
                                            <Grid containter id="stkMain">
                                                <Grid item id="stkApprove" xs={6} xl={6}>
                                                    <span id="rewardAmount">
                                                        {rewardAmountB ? (rewardAmountB).toFixed(6) : 0} SOLV
                                                    </span>
                                                </Grid>

                                                < Grid item id="stkApprove" xs={12} xl={12}>
                                                    <Button id="approveBtn" onClick={() => claim()}>Claim</Button>
                                                </Grid>
                                            </Grid> : '' :
                                        cLock == 0 ?
                                            <Grid containter id="stkMain">
                                                <Grid item id="stkApprove" xs={6} xl={6}>
                                                    <span id="rewardAmount">
                                                        {rewardAmountC ? (rewardAmountC).toFixed(6) : 0} SOLV
                                                    </span>
                                                </Grid>

                                                < Grid item id="stkApprove" xs={12} xl={12}>
                                                    <Button id="approveBtn" onClick={() => claim()}>Claim</Button>
                                                </Grid>
                                            </Grid> : ''
                                    : ''
                            }
                            <Box id="footer"><span>APY is Dynamic*</span></Box>
                        </Box>
                    </Box>
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

export default StakingLayout;
