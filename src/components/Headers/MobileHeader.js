import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import "assets/css/components/MobileHeader.scss"
import axios from "axios";
import componentStyles from "assets/theme/components/admin-navbar.js";
import config from "config/index.js"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import settingPng from "assets/img/SolviewIcons/ChartPage/Setting.svg";
import solviewPng from "assets/img/brand/solview_1.png"
require('@solana/wallet-adapter-react-ui/styles.css');

const useStyles = makeStyles(componentStyles);

export default function Header() {

    //current solview token price
    const [solvPrice, setSolvPrice] = useState(0);

    //to get current solview token price
    const getSolvPrice = async () => {
        let url = config.serverUrl + "/trade/trade";
        let tokenData = await axios.post(url, { token: 'SOLV' });
        let data = tokenData.data.data.items[0];
        if (data && data.price) {
            setSolvPrice(parseFloat(data.price));
        }
    }

    useEffect(() => {
        getSolvPrice();
    }, []);

    const classes = useStyles();
    return (
        <>
            <AppBar id="mobileHeader">
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
                            id="mobileSetting"
                        >
                            <Grid display="flex" container alignItems="center" width="auto">
                                <Grid item xs={6} xl={6} sm={6} className="mobileButtonGroup1" >
                                    <Button id="priceUsd" onClick={() => getSolvPrice}>USD</Button>
                                    <Button id="priceSolv"><img id="usd" src={solviewPng}></img>&nbsp;${(solvPrice).toFixed(4)}</Button>
                                </Grid>
                                <Grid item xs={6} xl={6} sm={6} className="mobileButtonGroup2">
                                    <Button ><img src={settingPng}></img></Button>
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
