import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import "assets/css/Style.scss"
import componentStyles from "assets/theme/components/admin-navbar.js";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { save_holder_data, save_gainer_data, save_chart_data, save_loser_data, save_address_data, save_otherAddress_data, save_promoted_data, save_transaction_data, save_symbol_data, save_pair_data, save_token_data, save_nft_data } from "redux/actions/provider";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { clusterApiUrl } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, createConnectionConfig, } from "@nfteyez/sol-rayz";
import Logo from "../assets/img/breeding/logo.png";

require('@solana/wallet-adapter-react-ui/styles.css');


const useStyles = makeStyles(componentStyles);

export default function Header() {

  const history = useHistory();
  const dispatch = useDispatch();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  //to get wallet address that is connected
  const getWalletAddress = async () => {
    dispatch(save_address_data(publicKey.toBase58()));
  }

  //when users connect to their wallet
  useEffect(() => {
    if (publicKey) {
      getWalletAddress();
      console.log(connection);
    }
  }, [publicKey])

  useEffect(() => {
  }, []);

  const classes = useStyles();
  return (
    <Container id="header">
      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={5}>
        <img src={Logo} className={'logo'}></img>
      </Grid>
      <Grid container direction="row" justify="space-between" alignItems="center" className="connect_group">
        <Button id="usdButton">0.00<text>SOL</text></Button>
        <WalletMultiButton />
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center" spacing={5} className="caption">
        <text>NUKED APE RESCUE MISSIONS</text>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center" spacing={5} className="sub_caption">
        <text>Send 2 Stoned Apes on a mission to rescue a Nuked Ape.</text>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center" spacing={5} className="header_hole">
      </Grid>
    </Container>
  );
}
