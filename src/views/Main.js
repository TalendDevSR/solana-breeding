import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";
import { LinearProgress } from "@material-ui/core";

import Header from "./Header";
import Card from "../components/Card";

import {
  ScrollingProvider,
  useScrollSection,
  Section,
} from 'react-scroll-section';

function Main() {
  return (
    <ScrollingProvider>
      <div className="header_container">
        <Header />
      </div>
      <div className="main_container">
        <Container>
          <Grid Container justify="center" spacing={10} style={{ height: '150px' }}>
          </Grid>
          <Grid Container justify="center" spacing={10}>
            {/* <Grid item xs={7} lg={3} className="grid_item"> */}
            <LinearProgress variant="determinate" value={3} />
            {/* </Grid> */}
          </Grid>
          <Grid Container justify="center" spacing={10} style={{ height: '50px' }}>
          </Grid>
          <Grid container justify="center" spacing={5}>
            <Grid item xs={6} lg={3} className="grid_item">
              <Card />
            </Grid>
            <Grid item lg={1} />
            <Grid item xs={6} lg={3} className="grid_item">
              <button type="button" style={{ height: '3rem', borderRadius: '1.5rem', border: '3px solid', background: 'black', borderColor: '#4e44ce', color: 'white', fontSize: '1.25rem', width: '11rem' }}>Start Mission</button>
            </Grid>
            <Grid item lg={1} />
            <Grid item xs={6} lg={3} className="grid_item">
              <Card />
            </Grid>
          </Grid>
          <Grid Container justify="center" spacing={10} style={{ height: '150px' }}>
          </Grid>
        </Container>

      </div>
      <div className="footer_container">
        <Grid container className="grid_item" direction="column">
          <text style={{ color: 'white', fontSize: '48px', fontWeight: 'bolder', marginTop: '50px' }}>On Rescue Mission</text>
          <div style={{ background: '#455158', width: '100%', maxWidth: '80rem', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '1rem' }}></div>
        </Grid>
        <Grid container className="grid_item" direction="column">
          <text style={{ color: 'white', fontSize: '48px', fontWeight: 'bolder', marginTop: '50px', marginTop: '8rem' }}>Recruiting System</text>
          <div style={{ background: '#455158', width: '100%', maxWidth: '80rem', padding: '0.75rem', borderRadius: '0.5rem', height: '10rem', marginTop: '1rem', marginBottom: '10rem' }}></div>
        </Grid>
      </div>

      
    </ScrollingProvider>
  );
}

export default Main;
