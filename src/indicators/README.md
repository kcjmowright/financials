Indicators
============================


## Relative Strength Index (RSI)

### Calculation

( 100.0 - ( 100.0 / ( 1.0 + rs ) ))

where rs = average gains / average losses

### Bullish Failure Swing

![Bullish Failure Swing](relative-strength-bullish-failure-swing.png)

### Bearish Failure Swing

(todo)

## Simple Moving Average SMA

Average of the last x data points.  As new data points are available then the window shifts.
SMA is a lagging indicator used to confirm past actions.

[SimpleMovingAverage](simple-moving-average.ts)

## Exponential Moving Average EMA

A weighted moving average where more weight is given to the newer data points.
EMA is a lagging indicator used to confirm past actions.

See also https://www.compose.com/articles/metrics-maven-calculating-an-exponentially-weighted-moving-average-in-postgresql/

## MACD

### Calculation

26 day EMA minus 12 day EMA.  9 day EMA is then used as the signal line.

(todo)

-------------------

## Chart Patterns

Bases for patterns have these quantitative attributes; depth and duration.

Duration begins in a stock's first down week after marking the left side high of the base.

### Cup with Handle Pattern

- Preconditions: 30% uptrend or 20% increase from prior breakout.
- Duration: 7 weeks or if no handle 6 weeks. Handle 5+ days but need to be less than cup in duration and depth.
- Depth: Between 8-12% and 30-33%.  In bear markets (what is a bear market?) the handle could be a double-digit decline of 40-50%.
  Shallow is better.  Volume should be light in the base and handle. 
- Handle usually forms with a down day in prices.  Proper handle should form in the upper part of the cup.
  The midpoint of the handle should be above the midpoint of the cup.   
  Midpoint of the cup or handle is the average of the highest price and the lowest price of the cup or handle.
  The handle should have a downward slope but not too steep otherwise it is flawed.
- Buy point should be the highest point of the handle + $0.10.  Volume should be 40% above its 50-day average.


### Cup Pattern

- Duration: 6 weeks
- Depth: 15% to 33%

### Flat Bases Pattern

- Duration: 5 weeks
- Depth: most likely less than 15%


### Double Bottoms Pattern

- Depth: 15% to 33%

### Ascending Bases

- Depth: 3 separate pullbacks of 15% to 20% in a stair-step fashion.


### Saucer


### IPO Base


### High, Tight Flag
