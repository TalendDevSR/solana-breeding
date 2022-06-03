import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Search from "@material-ui/icons/Search";
import "layouts/Dashboard.css"
import Sidebar from "components/Sidebar/Sidebar.js";
import NavbarDropdown from "components/Dropdowns/NavbarDropdown.js";
import routes from "routes.js";
import componentStyles from "assets/theme/layouts/admin.js";
import AddressCheckerView from "views/main/AddressChecker";
import { useDispatch } from "react-redux";

import { change_header, save_otherAddress_data, } from "redux/actions/provider";
require('@solana/wallet-adapter-react-ui/styles.css');


const useStyles = makeStyles(componentStyles);
const Admin = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const location = useLocation();

  const [address, addressSet] = useState('');
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location]);


  //When the user inputs token address(mobile)
  const changeAddress = (value) => {
    addressSet(value);
  }
  const addressSearch = () => {
    dispatch(change_header('false'))
    dispatch(save_otherAddress_data(address));
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
                  <InputAdornment position="end" onClick={() => addressSearch()}>
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
          <AddressCheckerView />
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

export default Admin;
