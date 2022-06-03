import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
// import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Typography from "@material-ui/core/Typography";
import "assets/css/views/AddressChecker.scss"
import AdTokenTable from "components/Navbars/AdTokenTable.js"
import AdNftTable from "components/Navbars/AdNftTable.js"
import componentStyles from "assets/theme/views/admin/dashboard.js";
import { useDispatch } from "react-redux";
import DigitalPng from "assets/img/icons/digital.png"
import PortofolioPng from "assets/img/icons/portfolio.png"
import { useSelector } from "react-redux";

import AddressCheckerPng from "assets/img/SolviewIcons/AddressChecker/Address_blue.svg"
const useStyles = makeStyles(componentStyles);

function Dashboard() {
    const dispatch = useDispatch();

    const classes = useStyles();
    const theme = useTheme();
    const netWorth = useSelector((store) => store.provider.othernetworth);
    return (
        <>
            <Container
                maxWidth={false}
                component={Box}
                marginTop="-9rem"
                id="container"
                classes={{ root: classes.containerRoot }}
            >
                <Grid container id="dashboardLogo">
                    <Grid className="dashImgChip"><img src={AddressCheckerPng}></img></Grid>&nbsp;&nbsp;
                    <Grid id="dashboardLetter">Address Checker</Grid>
                </Grid>
                <Grid container component={Box} marginTop="3rem">
                    <Grid
                        item
                        xs={12}
                        xl={3}
                        component={Box}
                        marginBottom="3rem! important"
                        classes={{ root: classes.gridItemRoot }}
                    >
                        <Card
                            classes={{
                                root: classes.cardRoot,
                            }}
                            id="netWorth"
                        >
                            <CardHeader
                                subheader={
                                    <Grid
                                        container
                                    >
                                        <Grid item xs={12} xl={12} id="nwName">Net Worth</Grid>
                                        <Grid item xs={12} xl={12} id="nwValue">{(netWorth) ? ('$' + netWorth.toFixed(2)) : ''}</Grid>
                                    </Grid>
                                }
                                classes={{ root: classes.cardHeaderRoot }}
                            ></CardHeader>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container component={Box} marginTop="3rem">
                    <Grid
                        item
                        xs={12}
                        xl={12}
                        component={Box}
                        marginBottom="3rem! important"
                        classes={{ root: classes.gridItemRoot }}
                    >
                        <Card
                            classes={{
                                root: classes.cardRoot,
                            }}
                            id="dashTable"
                        >
                            <CardHeader
                                id="cardHeader"
                                subheader={
                                    <Grid
                                        container
                                        component={Box}
                                    >
                                        <Grid item>
                                            <Box
                                                component={Typography}
                                                variant="h3"
                                                id="porto"
                                            >
                                                <Grid id="portoImg"><img src={DigitalPng}></img></Grid>
                                                <Grid id="portoName">Portfolio Overview</Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box
                                                component={Typography}
                                                variant="h3"
                                            >

                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                                classes={{ root: classes.cardHeaderRoot }}
                            ></CardHeader>
                            <TableContainer id="cardContent">
                                <AdTokenTable />
                            </TableContainer>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container component={Box} marginTop="3rem">
                    <Grid
                        item
                        xs={12}
                        xl={12}
                        component={Box}
                        marginBottom="3rem! important"
                        classes={{ root: classes.gridItemRoot }}
                    >
                        <Card
                            classes={{
                                root: classes.cardRoot,
                            }}
                            id="dashTable"
                        >
                            <CardHeader
                                id="cardHeader"
                                subheader={
                                    <Grid
                                        container
                                        component={Box}
                                    >
                                        <Grid item xs="4">
                                            <Box
                                                component={Typography}
                                                variant="h3"
                                                id="digital"
                                            >
                                                <Grid id="digitalImg"><img src={PortofolioPng}></img></Grid><Grid id="digitalName">Digital Collectibles</Grid>
                                            </Box>
                                        </Grid>
                                        <Grid item xs="8">
                                            <Box
                                                component={Typography}
                                                variant="h3"
                                            >
                                            </Box>
                                        </Grid>
                                    </Grid>
                                }
                                classes={{ root: classes.cardHeaderRoot }}
                            ></CardHeader>
                            <TableContainer id="cardContent">
                                <AdNftTable />
                            </TableContainer>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Dashboard;
