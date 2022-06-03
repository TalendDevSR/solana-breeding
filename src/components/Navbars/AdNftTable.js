import React, { useEffect, useState } from 'react';
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import Button from "@material-ui/core/Button";
import "assets/css/components/navbars/AdNftTable.scss"
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { clusterApiUrl } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, createConnectionConfig, } from "@nfteyez/sol-rayz";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import axios from 'axios';

export default function AdNftTable() {
    const address = useSelector((store) => store.provider.otheraddress);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState('');
    const [NftDetail, setNftDetail] = useState('');
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

    const useSortableData = (items, config = null) => {
        const [sortConfig, setSortConfig] = React.useState(config);
        const sortedItems = React.useMemo(() => {
            let sortableItems = [...items];
            if (sortConfig !== null) {
                sortableItems.sort((a, b) => {
                    if (a.data[sortConfig.key] < b.data[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a.data[sortConfig.key] > b.data[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
            return sortableItems;
        }, [items, sortConfig]);

        const requestSort = (key) => {
            let direction = 'ascending';
            if (
                sortConfig &&
                sortConfig.key === key &&
                sortConfig.direction === 'ascending'
            ) {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
        };

        return { items: sortedItems, requestSort, sortConfig };
    };

    const ProductTable = (props) => {
        const { items, requestSort, sortConfig } = useSortableData(props.products);
        const getClassNamesFor = (name) => {
            if (!sortConfig) {
                return;
            }
            return sortConfig.key === name ? sortConfig.direction : undefined;
        };

        return (
            <Box
                component={Table}
                alignItems="center"
                marginBottom="0!important"
            >
                <TableHead id="tabelheader">
                    <TableRow >
                        <TableCell class="tablecell">
                            <Button id="assetButton"
                                onClick={() => requestSort('name')}
                                className={getClassNamesFor('name')}
                            >COLLECTIBLE<SortByAlphaIcon /></Button>
                        </TableCell>
                        <TableCell class="tablecell">
                            ACTION
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, key) => (
                        (key % 2 == 0) ?
                            <TableRow id="blackCell" key={key}>
                                <TableCell>{item.data.name}</TableCell>
                                <TableCell id="ButtonRow"><Button id="detailButton" onClick={() => handleClickOpen(item.data.uri)}>MORE</Button></TableCell>
                            </TableRow> :
                            <TableRow id="greyCell" key={key} >
                                <TableCell>{item.data.name}</TableCell>
                                <TableCell id="ButtonRow"><Button id="detailButton" onClick={() => { handleClickOpen(item.data.uri) }}>MORE</Button></TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Box >

        );
    };
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

    const handleClickOpen = async (url) => {
        setOpen(true);
        let nftUrl = (url.split('\u0000'))[0]
        let nftMoreData = await axios.get(nftUrl);
        setNftDetail(nftMoreData.data);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDataClose = async () => {
        setOpen(false);
    };

    const getAllNftData = async () => {
        const connect = createConnectionConfig(clusterApiUrl("mainnet-beta"));
        const nfts = await getParsedNftAccountsByOwner({
            publicAddress: address,
            connection: connect,
            serialization: true,
        });

        setData(nfts)
        console.log(nfts, "nft")
    };

    useEffect(() => {
        getAllNftData();
    }, [address])

    return (
        <div className="App" id="DashNft">
            <ProductTable
                products={data}
            />
            <Dialog onClose={handleClose} id="moreModal" aria-labelledby="customized-dialog-title" open={open}>
                <Grid id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="h3" id="nftModalName">{NftDetail.collection ? NftDetail.collection.name : ''}</Typography>
                </Grid>
                <Grid id="moreNftImageBox">
                    <img id="moreNftImage" src={NftDetail ? NftDetail.image : ''}></img>
                </Grid>
                <Grid id="attrValue">
                    <Typography gutterBottom id="nftDescription">
                        Description
                    </Typography>
                    <Typography gutterBottom className="nftValue">
                        {NftDetail ? NftDetail.description : ''}
                    </Typography>
                    <Typography gutterBottom id="nftAttr">
                        Attributes
                    </Typography>
                    {NftDetail ? NftDetail.attributes.map((item, key) => (
                        <Typography key={key} gutterBottom className="nftValue">
                            {item.trait_type} &nbsp;&nbsp;&nbsp;&nbsp;{item.value}
                        </Typography>
                    )) : ''}
                </Grid>
                <Grid id="actionButton">
                    <Button autoFocus color="primary">
                        <OpenInNewIcon />
                    </Button>
                    <Button autoFocus onClick={() => handleDataClose()} color="primary">
                        OK
                    </Button>
                </Grid>
            </Dialog>
        </div>
    );
}
