import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import "assets/css/Style.scss"
import componentStyles from "assets/theme/components/admin-navbar.js";
import NFT from "../assets/img/breeding/hero.png";

require('@solana/wallet-adapter-react-ui/styles.css');

const useStyles = makeStyles(componentStyles);

export default function Card() {

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ borderRadius: '0.375rem', backgroundColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Rescue Hero 1</h2>
                </div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <img src={NFT} className="hero_card"></img>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
                    <button type="button" style={{ color: 'white', height: '2rem', borderRadius: '5px', border: '1px solid', background: 'transparent', fontSize: '1.125rem', fontWeight: '600' }}>Select or Recruit Ape 2</button>
                </div>

            </div>


        </div>
    );
}
