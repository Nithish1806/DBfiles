import React, { useEffect, useState, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import { StockService } from '../services/stocks/stocks.service';
import { useTheme } from '../services/theme/ThemeContext';
import { Tab, Tabs, Typography, Box } from '@mui/material'; // Correct import for Material-UI
// import StockSummary from './StockSummary'; // Assuming this component exists for stock summary

interface DetailsProps {
  tickerSymbol: string;
}

const Details: React.FC<DetailsProps> = ({ tickerSymbol }) => {
  const { isDarkMode } = useTheme();
  const [companyName, setCompanyName] = useState('');
  const [exchangeCode, setExchangeCode] = useState('');
  const [lastPrice, setLastPrice] = useState(0);
  const [arrowUp, setArrowUp] = useState(false);
  const [changeString, setChangeString] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [marketStatus, setMarketStatus] = useState(true);
  const [marketClosed, setMarketClosed] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [isLoading, setIsLoading] = useState(true);
  const [incorrectTicker, setIncorrectTicker] = useState(false);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const stockService = new StockService();

  useEffect(() => {
    if (tickerSymbol) {
      setDetailsLoaded(false);
      setSummaryLoaded(false);
      fetchStockDetails(tickerSymbol);
      loadStockDetails(tickerSymbol);
    }
  }, [tickerSymbol]);

  const fetchStockDetails = useCallback(async (ticker: string) => {
    setIsLoading(true);
    setIncorrectTicker(false);

    try {
      const dataobj = await stockService.getStockDetails(ticker);
      console.log("Stock Details:", dataobj[0]);

      if (dataobj.length > 0) {
        setCompanyName(dataobj[0].name || 'N/A');
        setExchangeCode(dataobj[0].exchangeCode || 'N/A');
        setDetailsLoaded(true);
      } else {
        setIncorrectTicker(true);
        console.error('Error: Stock details not found.');
      }
    } catch (error) {
      setIsLoading(false);
      setIncorrectTicker(true);
      console.error('Error fetching stock details:', error);
    }
  }, []);

  const loadStockDetails = useCallback(async (ticker: string) => {
    try {
      const data = await stockService.getSummary(ticker);
      console.log("Stock Summary:", data);

      setLastPrice(data.lastPrice || 0);
      setArrowUp(data.lastPrice > data.prevClose);
      setChangeString(getChangeString(data.lastPrice, data.prevClose));
      setCurrentTime(new Date().toLocaleTimeString());
      setMarketStatus(data.marketStatus);
      setMarketClosed(data.marketClosed || '');
      setCompanyName(data.companyName || 'N/A');
      setExchangeCode(data.exchangeCode || 'N/A');
      setSummaryLoaded(true);
    } catch (error) {
      console.error('Error loading stock summary:', error);
    }
  }, []);

  useEffect(() => {
    if (detailsLoaded && summaryLoaded) {
      setIsLoading(false);
    }
  }, [detailsLoaded, summaryLoaded]);

  const getChangeString = (lastPrice: number, prevClose: number): string => {
    const change = lastPrice - prevClose;
    const percentage = (change / prevClose) * 100;
    return `${change.toFixed(2)} (${percentage.toFixed(2)}%)`;
  };

  const getColor = () => (arrowUp ? 'green' : 'red');

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Update localStorage or server accordingly
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className={`pb-3 ${isDarkMode ? 'dark' : 'light'}`}>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader">Loading...</div> {/* Add your loader component or animation here */}
        </div>
      ) : (
        <div>
          <div className="flex flex-row justify-between">
            <div className="w-1/2 items-center justify-start p-5">
              <div className="flex items-start">
                <div className="me-2">
                  <p className="text-3xl font-semibold">{tickerSymbol}</p>
                </div>
                <div>
                  {isFavorite ? (
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      className="bi bi-star-fill text-yellow-500 cursor-pointer"
                      onClick={toggleFavorite}
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                  ) : (
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      className="bi bi-star text-gray-500 cursor-pointer"
                      onClick={toggleFavorite}
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xl">{companyName}</p>
              <p className="text-xl uppercase">{exchangeCode}</p>
              <button
                className="mt-2 px-6 py-3 rounded-lg bg-green-600 text-white"
                onClick={() => console.log('Open Purchase Modal')}
              >
                Buy
              </button>
            </div>
            <div className="w-1/2 text-right p-8">
              <div>
                <div
                  className="text-4xl"
                  style={{ color: getColor(), fontSize: '40px', padding: '15px' }}
                >
                  {lastPrice}
                </div>
                <div className="flex items-center justify-end">
                  {arrowUp ? (
                    <svg
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 16 16"
                      className="bi bi-caret-up-fill"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="green"
                        d="M7.247 4.86l-4.796 5.481c-.566.648-.157 1.659.718 1.659h9.592c.875 0 1.284-1.011.718-1.659l-4.796-5.481a1.003 1.003 0 0 0-1.436 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="1.2em"
                      height="1.2em"
                      viewBox="0 0 16 16"
                      className="bi bi-caret-down-fill"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="red"
                        d="M7.247 11.14l4.796-5.481c.566-.648.157-1.659-.718-1.659H2.733c-.875 0-1.284 1.011-.718 1.659l4.796 5.481a1.003 1.003 0 0 0 1.436 0z"
                      />
                    </svg>
                  )}
                  <span className="ms-2" style={{ color: getColor() }}>
                    {changeString}
                  </span>
                </div>
                <p className="text-sm mt-3">As of {currentTime}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            {marketStatus ? (
              <p className="text-lg text-green-600">Market is Open</p>
            ) : (
              <p className="text-lg text-red-600">Market is closed</p>
            )}
          </div>
          <div className="mt-6">
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              variant="fullWidth"
              centered
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Tab label="Summary" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
              <Tab label="Top News" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
              <Tab label="Charts" sx={{ flexGrow: 1, maxWidth: 'none', textAlign: 'center' }} />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
            {/* <StockSummary
  ticker={tickerSymbol}
  companyName={companyName}
  exchangeCode={exchangeCode}
  lastPrice={lastPrice}
  arrowUp={arrowUp}
  changeString={changeString}
  currentTime={currentTime}
  marketStatus={marketStatus}
  marketClosed={marketClosed}
  highPrice={highPrice}
  lowPrice={lowPrice}
  openPrice={openPrice}
  prevClose={prevClose}
  volume={volume}
  midPrice={midPrice}
  askPrice={askPrice}
  askSize={askSize}
  bidPrice={bidPrice}
  bidSize={bidSize}
  startDate={startDate}
  description={description}
/> */}

              <Typography>Summary Content Goes Here</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              {/* Implement Top News Component */}
              <Typography>Top News Content Goes Here</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              {/* Implement Charts Component */}
              <div id="container">
                <Typography>Charts Content Goes Here</Typography>
              </div>
            </TabPanel>
          </div>
        </div>
      )}
    </div>
  );
};

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default Details;
