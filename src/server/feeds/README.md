Feeds
=====

https://www.programmableweb.com/news/96-stocks-apis-bloomberg-nasdaq-and-etrade/2013/05/22
https://www.quantshare.com/sa-43-10-ways-to-download-historical-stock-quotes-data-for-free

### Company Fundamental Data Feeds

https://www.google.com/finance?q=[exchange:symbol]&fstype=ii


- Balance Sheets
- Income Statements
- Cash Flows

See [GoogleFinanceFinancialsService](google-finance-financials-service.ts)

### Stock Quote Feeds

https://app.quotemedia.com/quotetools/getHistoryDownload.csv?&webmasterId=501&startDay=01&startMonth=01&startYear=2017&endDay=12&endMonth=06&endYear=2017&isRanged=false&symbol=NVDA

See [QuotemediaStream](quotemedia-stream.ts)

http://www.google.com/finance/historical?q=NASDAQ%3ANVDA&output=csv

### Trade IT

Proxy API to brokerage web sites and APIs.

https://www.trade.it/

### Quantl

The premier source for financial, economic, and alternative datasets, serving investment professionals

https://www.quandl.com/

### Nasdaq

List of companies 

http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=AMEX&render=download
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download

Fundamentals

HTML only

http://www.nasdaq.com/symbol/{ticker}/financials?query=income-statement
http://www.nasdaq.com/symbol/{ticker}/financials?query=income-statement&data=quarterly
http://www.nasdaq.com/symbol/{ticker}/financials?query=balance-sheet
http://www.nasdaq.com/symbol/{ticker}/financials?query=cash-flow
http://www.nasdaq.com/symbol/{ticker}/financials?query=ratios

```
$('form[action="./financials?symbol=PIH&selected=PIH&query=ratios"] .genTable  h3').text().trim()
$('form[action="./financials?symbol=PIH&selected=PIH&query=ratios"] .genTable tr')
$('form[action="./financials?symbol=PIH&selected=PIH&query=ratios"] .genTable tr').text().split('\n').forEach(function(x) { console.log(x.trim()); });
```

Earnings report
http://www.nasdaq.com/earnings/report/{ticker}

Symbol Summary
http://www.nasdaq.com/symbol/{ticker}

News
http://www.nasdaq.com/symbol/{ticker}/news-headlines


Volatility

Free Weekly Volatility Data
http://www.optionstrategist.com/calculators/free-volatility-data

Probability Calculator
http://www.optionstrategist.com/calculators/probability
