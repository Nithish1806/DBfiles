import React, { useEffect, useState, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { StockService } from '../services/stocks/stocks.service';

interface StockSummaryProps {
  ticker: string;
  companyName: string;
  exchangeCode: string;
  lastPrice: number;
  arrowUp: boolean;
  changeString: string;
  currentTime: string;
  marketStatus: boolean;
  marketClosed: string;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  prevClose: number;
  volume: number;
  midPrice?: number;
  askPrice?: number;
  askSize?: number;
  bidPrice?: number;
  bidSize?: number;
  startDate: string;
  description: string;
}

const StockSummary: React.FC<StockSummaryProps> = ({
  ticker,
  companyName,
  exchangeCode,
  lastPrice,
  arrowUp,
  changeString,
  currentTime,
  marketStatus,
  marketClosed,
  highPrice,
  lowPrice,
  openPrice,
  prevClose,
  volume,
  midPrice,
  askPrice,
  askSize,
  bidPrice,
  bidSize,
  startDate,
  description,
}) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [isLoading, setIsLoading] = useState(true);

  const stockService = new StockService();

  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await stockService.getSummary(ticker);
      setIsLoading(false);
      // Update the state based on the data received
      // ... (set states like highPrice, lowPrice, etc.)
      handleUpdate(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }, [ticker, stockService]);

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchStockData]);

  const handleUpdate = (data: any) => {
    setChartOptions({
      rangeSelector: { inputEnabled: false },
      title: { text: ticker },
      series: [{ type: 'line', data: data.chartData, color: getColor() }],
      chart: { renderTo: 'container' },
      xAxis: { type: 'datetime' },
    });
  };

  const getColor = () => {
    if (changeString.startsWith('-')) return 'red';
    if (changeString.startsWith('+')) return 'green';
    return 'black';
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-wrap">
        <div className="flex flex-wrap pt-3 w-full">
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <div className="w-1/2">
                <p>High Price: {highPrice}</p>
                <p>Low Price: {lowPrice}</p>
                <p>Open Price: {openPrice}</p>
                <p>Prev. Close: {prevClose}</p>
                <p>Volume: {volume}</p>
              </div>
              <div className="w-1/2">
                {!marketStatus && (
                  <>
                    <p>Mid Price: {midPrice}</p>
                    <p>Ask Price: {askPrice}</p>
                    <p>Ask Size: {askSize}</p>
                    <p>Bid Price: {bidPrice}</p>
                    <p>Bid Size: {bidSize}</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-center mt-4 text-2xl font-bold">Company's Description</h2>
              <p>Start Date: {startDate}</p>
              <p className="text-justify">{description}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              style={{ width: '100%', height: '400px', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
