import { REGISTER_SHOP, SYMBOL, GAINER, OTHERADDRESS, APPOINTMENTSDATA, LOSER, PROMOTED, ADDRESS, HOLDER, PROVIDERSHOP, TOKENDATA, PERSONNFT, TRANSACTIONDATA, NETWORTH, SIDEBAR, CHARTDATA, NFTDATA, PAIR, OTHERNETWORTH } from "../../constants";

export const register_shop_store = (params) => {
    return (dispatch) => {
        dispatch({
            type: REGISTER_SHOP,
            payload: params,
        });
    }
};

export const appoint_set = (params) => {
    return (dispatch) => {
        dispatch({
            type: APPOINTMENTSDATA,
            payload: params,
        });
    }
};


export const shop_set = (params) => {
    return (dispatch) => {
        dispatch({
            type: PROVIDERSHOP,
            payload: params,
        });
    }
};

export const save_token_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: TOKENDATA,
            payload: params,
        });
    }
};

export const save_transaction_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: TRANSACTIONDATA,
            payload: { transaction: params },
        });
    }
};

export const save_nft_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: NFTDATA,
            payload: { nftdata: params },
        });
    }
};

export const save_chart_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: CHARTDATA,
            payload: { chart: params },
        });
    }
};

export const change_header = (params) => {
    console.log(params, "para")
    return (dispatch) => {
        dispatch({
            type: SIDEBAR,
            payload: { sidebar: params },
        });
    }
};

export const save_promoted_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: PROMOTED,
            payload: { promoted: params },
        });
    }
};

export const save_pair_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: PAIR,
            payload: { pair: params },
        });
    }
}

export const save_networth_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: NETWORTH,
            payload: { networth: params },
        });
    }
}
export const save_personal_nft = (params) => {
    return (dispatch) => {
        dispatch({
            type: PERSONNFT,
            payload: { personnft: params },
        });
    }
}
export const save_address_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: ADDRESS,
            payload: { address: params },
        });
    }
}
export const save_holder_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: HOLDER,
            payload: { holder: params },
        });
    }
}
export const save_gainer_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: GAINER,
            payload: { gainer: params },
        });
    }
}
export const save_otherAddress_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: OTHERADDRESS,
            payload: { otheraddress: params },
        });
    }
}
export const save_othernetworth_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: OTHERNETWORTH,
            payload: { othernetworth: params },
        });
    }
}
export const save_loser_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: LOSER,
            payload: { loser: params },
        });
    }
}
export const save_symbol_data = (params) => {
    return (dispatch) => {
        dispatch({
            type: SYMBOL,
            payload: { symbol: params },
        });
    }
}