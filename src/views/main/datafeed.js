import {
	parseFullSymbol,
} from './helpers.js';
// import axios from "axios";

// import { useSelector } from 'react-redux';
// import {
// 	subscribeOnStream,
// 	unsubscribeFromStream,
// } from './streaming.js';
// import { useSelector } from "react-redux";

const lastBarsCache = new Map();

const configurationData = {
	supported_resolutions: ['1D', '1W', '1M'],
	exchanges: [{
		value: 'SOLANA',
		name: 'SOLANA',
		desc: 'SOLANA',
	}
	],
};


// export default function datafeed() {
export const onReady = (callback) => {
	setTimeout(() => callback(configurationData));
}

export const resolveSymbol = async (
	symbolName,
	onSymbolResolvedCallback,
	onResolveErrorCallback,
) => {
	const symbolData = {
		ticker: "Solana:SOLV/USD",
		name: "SOLV/USD",
		description: "SOLV/USD",
		type: "crypto",
		session: '24x7',
		timezone: 'Etc/UTC',
		exchange: "Solana",
		minmov: 1,
		pricescale: 100,
		has_intraday: false,
		has_no_volume: true,
		has_weekly_and_monthly: false,
		supported_resolutions: configurationData.supported_resolutions,
		volume_precision: 2,
		data_status: 'streaming',
	}
	onSymbolResolvedCallback(symbolData);
}

export const getBars = async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
	const { from, to, firstDataRequest } = periodParams;
	const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
	const urlParameters = {
		e: parsedSymbol.exchange,
		fsym: parsedSymbol.fromSymbol,
		tsym: parsedSymbol.toSymbol,
		toTs: to,
		limit: 2000,
	};
	const query = Object.keys(urlParameters)
		.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
		.join('&');
	try {
		// const chartData = useSelector((store) => store.provider.chart);

		// const data = await axios.get(`http://min-api.cryptocompare.com/data/histoday?${query}`);
		const data = {
			"Response": "Success", "Type": 100, "Aggregated": false, "TimeTo": 1641513600, "TimeFrom": 1468713600, "FirstValueInArray": true, "ConversionType": { "type": "force_direct", "conversionSymbol": "" },
			"Data": [
				{ "time": 1468713600, "close": 680.37, "high": 689.96, "low": 663.61, "open": 664.41, "volumefrom": 19465.55, "volumeto": 13189216.83, "conversionType": "force_direct", "conversionSymbol": "" },
				{ "time": 1468800000, "close": 674.19, "high": 686.74, "low": 666.02, "open": 683.99, "volumefrom": 17486.99, "volumeto": 11839820.79, "conversionType": "force_direct", "conversionSymbol": "" },
				{ "time": 1468886400, "close": 674.93, "high": 676.51, "low": 665, "open": 673.19, "volumefrom": 10466.13, "volumeto": 7027149.75, "conversionType": "force_direct", "conversionSymbol": "" },
				{ "time": 1468972800, "close": 667.22, "high": 676, "low": 661, "open": 675.08, "volumefrom": 12698.37, "volumeto": 8480645.47, "conversionType": "force_direct", "conversionSymbol": "" },
				{ "time": 1469059200, "close": 664.99, "high": 668, "low": 654.97, "open": 665.6, "volumefrom": 10439.11, "volumeto": 6919560.65, "conversionType": "force_direct", "conversionSymbol": "" }
			]
		};
		if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
			// "noData" should be set if there is no data in the requested period.
			onHistoryCallback([], {
				noData: true,
			});
			return;
		}

		let bars = [];
		// const chartData = await axios.get('https://api.solscan.io/amm/ohlcv?address=8TpLegYhGc5z3PAJonMH6feHChy719xtiS17pLyzUnp4&type=15m&time_from=1641277224.177&time_to=1641363624.177')
		// chartData.data.data.items.forEach(bar => {
		// 	bars = [...bars, {
		// 		time: bar.unixTime * 1000,
		// 		low: bar.l,
		// 		high: bar.h,
		// 		open: bar.o,
		// 		close: bar.c,
		// 	}];
		// })
		data.Data.forEach(bar => {
			if (bar.time >= from && bar.time < to) {
				bars = [...bars, {
					time: bar.time * 1000,
					low: bar.low,
					high: bar.high,
					open: bar.open,
					close: bar.close,
				}];
			}
		});
		// if (firstDataRequest) {
		// 	lastBarsCache.set(symbolInfo.full_name, {
		// 		...bars[bars.length - 1],
		// 	});
		// }
		onHistoryCallback(bars, {
			noData: false,
		});
	} catch (error) {
		onErrorCallback(error);
	}
}

// };
