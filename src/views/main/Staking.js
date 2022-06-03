import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import "assets/css/views/NftChecker.scss"
import componentStyles from "assets/theme/views/admin/dashboard.js";
import { useSelector } from "react-redux";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

 
function NftChecker() {
    const styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });
 
    const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h3" id="nftModalName">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    const DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);
    const moreToken = (value) => {
        window.open("https://solscan.io/token/" + value, "_blank");
    }


    const useStyles = makeStyles(componentStyles);
    const [open, setOpen] = React.useState(false);
    const [findData, setFindData] = React.useState();
    const handleClickOpen = (name) => {
        let findData = nftdata.filter(item => item.name == name);
        setFindData(findData[0])
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();
    const theme = useTheme();
    let nftdata = useSelector((store) => store.provider.nftdata);
    return (
        <>
            <Container
                maxWidth={false}
                component={Box}
                id="container"
                classes={{ root: classes.containerRoot }}
            >
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        xl={12}
                        component={Box}
                        marginBottom="3rem!important"
                        classes={{ root: classes.gridItemRoot }}
                    >
                        <Card
                            classes={{
                                root: classes.cardRoot + " " + classes.cardRootBgGradient,
                            }}
                        >
                            <CardContent id="nftDataBox">
                                <Dialog onClose={handleClose} id="moreModal" aria-labelledby="customized-dialog-title" open={open}>
                                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                        {findData ? findData.name : ''}
                                    </DialogTitle>
                                    <Grid id="moreNftImageBox">
                                        <img id="moreNftImage" src={findData ? findData.image : ''}></img>
                                    </Grid>
                                    <DialogContent dividers>
                                        <Typography gutterBottom id="nftDescription">
                                            Description
                                        </Typography>
                                        <Typography gutterBottom className="nftValue">
                                            {findData ? findData.description : ''}
                                        </Typography>
                                        <Typography gutterBottom id="nftAttr">
                                            Attributes
                                        </Typography>
                                        {findData ? findData.attr.map((item, key) => (
                                            <Typography key={key} gutterBottom className="nftValue">
                                                {item.trait_type} &nbsp;&nbsp;&nbsp;&nbsp;{item.value}
                                            </Typography>
                                        )) : ''}
                                    </DialogContent>
                                    <DialogActions>
                                        <Button autoFocus onClick={(e) => moreToken(findData.address)} color="primary">
                                            <OpenInNewIcon />
                                        </Button>
                                        <Button autoFocus onClick={handleClose} color="primary">
                                            OK
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Grid cotainer spacing={2} id="nftImageGroup">
                                    {(!nftdata) ? '' : (nftdata.map((item, key) => (
                                        <Grid item key={key} lg={2} id="nftImagePair">
                                            <Grid id="nftImageChip" >
                                                <Grid lg={12} xs={12} id="nftImageBox">
                                                    <img src={item.image} id="nftImage"></img>
                                                </Grid>
                                                <Grid lg={12} xs={12} id="nftName">
                                                    <span>{item.name}({item.count})</span>
                                                </Grid>
                                                <Grid lg={12} xs={12} id="moreButton">
                                                    <Button id="moreButtonChip" onClick={(e) => handleClickOpen(item.name)} >MORE</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Container>
        </>
    );
}

export default NftChecker;
