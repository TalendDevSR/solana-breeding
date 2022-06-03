import { widget } from "./charting_library"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function TradingView() {
  const [timeframe, setTimeframe] = useState(15);
  const chartData = useSelector((store) => store.provider.chart)
  const tokenSymbol = useSelector((store) => store.provider.symbol);
  const configurationData = {
    supported_resolutions: ['1', '3', '5', '15', '30', '1h', '2h', '4h', '1D', '1W'],
    exchanges: [{
      value: 'SOLANA',
      name: 'SOLANA',
      desc: 'SOLANA',
    }
    ],
  };
  let Datafeed = {
    onReady: (callback) => {
      setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback,
    ) => {
      var symbolData = {
        ticker: `Solana:${tokenSymbol}/USD`,
        name: `${tokenSymbol}/USD`,
        description: `${tokenSymbol}/USD`,
        type: "crypto",
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: "Solana",
        minmov: 1,
        pricescale: 1000000000,
        has_intraday: true,
        has_no_volume: true,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
      }
      onSymbolResolvedCallback(symbolData);
    },

    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
      const { from, to } = periodParams;
      try {
        let bars = [];
        chartData.forEach(bar => {
          // console.log(((new Date(bar.timestamp)).getTime()), from, to, "why")
          if (((new Date(bar.timestamp)).getTime()) / 1000 >= from && ((new Date(bar.timestamp)).getTime()) / 1000 < to) {
            bars = [...bars, {
              time: ((new Date(bar.timestamp)).getTime()),
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            }];
          }
        });


        onHistoryCallback(bars, {
          noData: false,
        });

      } catch (error) {
        onErrorCallback(error);
      }
    },
    subscribeBars: (
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
    ) => {
      console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
      // subscribeOnStream(
      //   symbolInfo,
      //   resolution,
      //   onRealtimeCallback,
      //   subscribeUID,
      //   onResetCacheNeededCallback,
      //   lastBarsCache.get(symbolInfo.full_name),
      // );
    },

  }


  useEffect(() => {
    if (chartData && tokenSymbol) {
      window.tvWidget = new widget({
        symbol: 'Bitfinex:BTC/USD', // default symbol
        interval: timeframe, // default interval
        fullscreen: true, // displays the chart in the fullscreen mode
        container: 'tv_chart_container',
        datafeed: Datafeed,
        library_path: './charting_library/',
        theme: 'Dark'
      });
      // console.log(window.tvWidget, "tw")
      // window.tvWidget.onChartReady(() => {
      //   window.tvWidget.activeChart().onIntervalChanged().subscribe(null, (interval, timeframeObj) => {
      //     console.log(interval, "interval")
      //     if (interval < 60) {
      //       getChartData(interval + 'm');
      //       setTimeframe(interval)
      //     }
      //     if (interval >= 60 && interval <= 240) {
      //       getChartData(interval / 60 + 'H');
      //       setTimeframe(interval)
      //     }
      //     if (interval == "1D") {
      //       getChartData(interval);
      //       console.log("good")
      //       setTimeframe(interval)
      //     }
      //     if (interval == "1W") {
      //       getChartData(interval);
      //       getChartData(interval)
      //     }
      //   });
      // });
    }
  }, [chartData, tokenSymbol])

  return (
    <div id="tv_chart_container" ></div>
  );
}

export default TradingView;