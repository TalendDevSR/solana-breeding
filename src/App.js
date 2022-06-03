import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { Provider } from 'react-redux'
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "./App.css";
//main layouts
import Chart from "layouts/Chart.js";
import NftChecker from "layouts/NftChecker.js"
import AddressChecker from "layouts/AddressChecker.js"
import Dashboard from "layouts/Dashboard.js"
import Staking from "layouts/Staking.js"
import Launchpad from "layouts/Launchpad.js"
import LaunchpadDetail from "layouts/LaunchpadDetail.js"

import theme from "assets/theme/theme.js";
import Store from './redux/store/index.js'
import Header from "components/Headers/Header.js";
import MobileHeader from "components/Headers/MobileHeader.js";
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
require('@solana/wallet-adapter-react-ui/styles.css');
const store = Store();

const App = () => {
    const { publicKey } = useWallet();
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: { clientId: 'Get a client ID @ https://developer.tor.us' }
        }),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);


    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <ConnectionProvider endpoint={endpoint} id="connectButton">
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <Router>
                                <CssBaseline />
                                <MobileHeader />
                                <Header />
                                <Switch >
                                    <Route path="/Chart" component={Chart} />
                                    <Route path="/Dashboard" component={Dashboard} />
                                    <Route path="/NftChecker" component={NftChecker} />
                                    <Route path="/Staking" component={Staking} />
                                    <Route path="/Launchpad" component={Launchpad} />
                                    <Route path="/AddressChecker" component={AddressChecker} />
                                    <Route path="/Swap" component={() => { window.open('https://raydium.io/swap/', '_blank').then(window.location = '/') }} exact="true" />
                                    <Route path="/LaunchpadDetail" component={LaunchpadDetail} />
                                    <Redirect from="/" to="/Chart" />
                                </Switch>
                            </Router>
                        </WalletModalProvider >
                    </WalletProvider>
                </ConnectionProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
