import React, { useState, useEffect } from 'react';
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import Button from "@material-ui/core/Button";
import "assets/css/components/navbars/DaTokenTable.scss"
import axios from "axios";
import { useDispatch } from "react-redux";
import { save_networth_data } from "redux/actions/provider";
import * as anchor from "@project-serum/anchor";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from "react-redux";

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);
    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
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
                            onClick={() => requestSort('Asset')}
                            className={getClassNamesFor('Asset')}
                        >ASSET<SortByAlphaIcon /></Button>
                    </TableCell>
                    <TableCell class="tablecell">
                        <Button id="assetButton"
                            onClick={() => requestSort('Balance')}
                            className={getClassNamesFor('Balance')}
                        >BALANCE<SortByAlphaIcon /></Button>
                    </TableCell>
                    <TableCell class="tablecell">
                        <Button id="assetButton"
                            onClick={() => requestSort('Price')}
                            className={getClassNamesFor('Price')}
                        >PRICE<SortByAlphaIcon /></Button>
                    </TableCell>
                    <TableCell class="tablecell">
                        <Button id="assetButton"
                            onClick={() => requestSort('Value')}
                            className={getClassNamesFor('Value')}
                        >VALUE<SortByAlphaIcon /></Button>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((item, key) => (
                    (key % 2 == 0) ?
                        <TableRow id="blackCell" key={key}>
                            <TableCell id="tokenSymbol"><img id="tokenIcon" src={item.icon}></img>&nbsp;&nbsp;&nbsp;{item.Asset}</TableCell>
                            <TableCell >{((item.Balance).toFixed(2))}</TableCell>
                            <TableCell >{((item.Price).toFixed(6))}</TableCell>
                            <TableCell >{((item.Value).toFixed(5))}</TableCell>
                        </TableRow> :
                        <TableRow id="greyCell" key={key} >
                            <TableCell id="tokenSymbol"><img id="tokenIcon" src={item.icon}></img>&nbsp;&nbsp;&nbsp;{item.Asset}</TableCell>
                            <TableCell >{((item.Balance).toFixed(2))}</TableCell>
                            <TableCell >{((item.Price).toFixed(6))}</TableCell>
                            <TableCell >{((item.Value).toFixed(5))}</TableCell>
                        </TableRow>
                ))}
            </TableBody>
        </Box >

    );
};

export default function DaTokenTable() {
    const opts = {
        preflightCommitment: "processed"
    }
    const { connection } = useConnection();
    const { publicKey, sendTransaction, keypair } = useWallet();
    const wallet = useWallet();
    const address = useSelector((store) => store.provider.address);
    const dispatch = useDispatch();
    const [data, setData] = useState('');
    async function getProvider() {

        const provider = new anchor.Provider(
            connection, wallet, opts.preflightCommitment,
        );
        return provider;
    }

    const getTokenList = async () => {
        const TokenListDatas = await axios.get('https://api.solscan.io/account/tokens?address=' + address + '&price=1');
        const solToken = await axios.get(`https://api.solscan.io/account?address=${address}`);
        if (TokenListDatas.data.succcess === true) {
            const TokenListData = TokenListDatas.data.data;
            let networth = 0;
            const AccountToken = [];
            if (solToken.data.data && solToken.data.data.lamports) {
                var sol = {};
                sol.icon = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
                sol.Asset = 'SOL';
                sol.Balance = solToken.data.data.lamports / (10 ** 9);
                var price = await axios('https://api.solscan.io/account?address=So11111111111111111111111111111111111111112');
                sol.Price = price.data.data.tokenInfo.price;
                sol.Value = sol.Price * sol.Balance;
                AccountToken.push(sol);
                networth += sol.Value;
            }
            for (let i = 0; i < TokenListData.length; i++) {
                let TokenChip = {};
                if (TokenListData[i].tokenName !== "" && TokenListData[i].tokenAmount.uiAmount > 0) {
                    if (TokenListData[i].tokenAmount) {
                        TokenChip.Balance = TokenListData[i].tokenAmount.uiAmount;
                    }
                    else {
                        TokenChip.Balance = 0;
                    }
                    if (TokenListData[i].tokenIcon) {
                        TokenChip.icon = TokenListData[i].tokenIcon;
                    }
                    if (TokenListData[i].tokenSymbol) {
                        TokenChip.Asset = TokenListData[i].tokenSymbol;
                    }
                    if (TokenListData[i].priceUsdt) {
                        TokenChip.Price = TokenListData[i].priceUsdt;
                        TokenChip.Value = TokenChip.Balance * TokenListData[i].priceUsdt;
                        networth = networth + (TokenChip.Balance * TokenListData[i].priceUsdt);
                    }
                    else {
                        let marketData = await axios.get(`https://api.solscan.io/amm/market?address=${TokenListData[i].tokenAddress}&sort_by=liquidity&sort_type=desc`)
                        console.log(marketData, "markte")
                        if (marketData.data.data) {
                            let findUsdc = marketData.data.data.filter(item => item.quote.symbol == 'USDC');
                            if (findUsdc[0]) {
                                if (findUsdc[0].price) {
                                    TokenChip.Price = findUsdc[0].price
                                    TokenChip.Value = TokenChip.Balance * TokenChip.Price;
                                    networth = networth + (TokenChip.Balance * TokenChip.Price);
                                }
                                else {
                                    TokenChip.Price = 0;
                                    TokenChip.Value = 0;
                                }
                            }
                            else {
                                TokenChip.Price = 0;
                                TokenChip.Value = 0;
                            }

                        }

                    }
                    AccountToken.push(TokenChip);
                }
            }
            setData(AccountToken);
            dispatch(save_networth_data(networth));
        }
    }

    useEffect(() => {
        getTokenList();
    }, [address])
    return (
        <div className="App">
            <ProductTable
                products={data}
            />
        </div>
    );
}
