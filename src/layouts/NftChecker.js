import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
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
import NftChecker from "views/main/NFTChecker";
import { useDispatch } from "react-redux";
import { change_header, save_nft_data } from "redux/actions/provider";
import { clusterApiUrl } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, createConnectionConfig, } from "@nfteyez/sol-rayz";

const useStyles = makeStyles(componentStyles);
const NftCheckerLayout = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const [address, addressSet] = useState('');

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);

  const getNFTData = async () => {
    dispatch(change_header('false'))

    try {
      const connect = createConnectionConfig(clusterApiUrl("mainnet-beta"));
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: address,
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

  //When the user inputs token address(mobile)
  const changeAddress = (value) => {
    addressSet(value);
  }

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
                onChange={(event) => changeAddress(event.target.value)}
                id="outlined-adornment-search-responsive"
                type="text"
                endAdornment={
                  <InputAdornment position="end" onClick={() => getNFTData()}>
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
          <NftChecker />
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

export default NftCheckerLayout;
