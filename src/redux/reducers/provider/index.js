import { REGISTER_SHOP, HOLDER, GAINER, LOSER, SYMBOL, APPOINTMENTSDATA, NETWORTH, OTHERNETWORTH, PROMOTED, ADDRESS, PROVIDERSHOP, PERSONNFT, TOKENDATA, TRANSACTIONDATA, SIDEBAR, CHARTDATA, NFTDATA, PAIR, OTHERADDRESS } from "../../constants";

const Provider = (state = {}, action) => {
    switch (action.type) {
        case REGISTER_SHOP: {
            return {
                ...state,
                shop: {
                    ...state.shop,
                    ...action.payload,
                },
            };
        }
        case APPOINTMENTSDATA: {
            return {
                ...state,
                apdata: action.payload
            };
        }
        case PROVIDERSHOP: {
            return {
                ...state,
                pshop: action.payload
            };
        }
        case TOKENDATA: {
            return {
                ...state,
                token: {
                    ...state.token,
                    ...action.payload,
                },
            };
        }
        case TRANSACTIONDATA: {
            return {
                ...state,
                ...action.payload
            };
        }
        case CHARTDATA: {
            return {
                ...state,
                ...action.payload
            };
        }
        case NFTDATA: {
            return {
                ...state,
                ...action.payload
            };
        }
        case SIDEBAR: {
            return {
                ...state,
                ...action.payload
            };
        }
        case PROMOTED: {
            return {
                ...state,
                ...action.payload
            };
        }
        case PAIR: {
            return {
                ...state,
                ...action.payload
            };
        }
        case NETWORTH: {
            return {
                ...state,
                ...action.payload
            };
        }
        case PERSONNFT: {
            return {
                ...state,
                ...action.payload
            };
        }
        case ADDRESS: {
            return {
                ...state,
                ...action.payload
            };
        }
        case HOLDER: {
            return {
                ...state,
                ...action.payload
            };
        }
        case GAINER: {
            return {
                ...state,
                ...action.payload
            };
        }
        case OTHERADDRESS: {
            return {
                ...state,
                ...action.payload
            };
        }
        case OTHERNETWORTH: {
            return {
                ...state,
                ...action.payload
            };
        }
        case LOSER: {
            return {
                ...state,
                ...action.payload
            };
        }
        case SYMBOL: {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            return { ...state };
        }
    }
};
export default Provider;
