To start the server

- Run `npm install` to install required packages.
- Then, run `npm run start` to start the server
- To test, run `npm run test`


# API

## 1. Exchange Rate API

### 1.1. URL

/api/exchangerate

### 1.2. Parameters

- **from**: Symbol of the base currency. Examples: `EUR`, `USD`, `TRY`
- **to**: Symbol of the currency to be converted. Examples: `EUR`, `USD`, `TRY`

> from parameter is optional. When it is not given, it will be assumed as `TRY`.

### 1.3. Return Format

```
{
  "from": FROM-PARAMETER,
  "to": {
    TO-PARAMETER: RATE
  }
}
```

**Example**

```
{
  "from": "USD",
  "to": {
    "TRY": 5.974361273
  }
}
```

### 1.4. Request Type

Only `GET` allowed.

### 1.5. Examples

**Request**
```
GET example.com/api/exchangerate?from=USD&to=EUR
```

**Response**
```
{
  "from": "USD",
  "to": {
    "EUR": 0.896458987
  }
}
```

**Request**
```
GET example.com/api/exchangerate?to=JPY
```

**Response**

```
{
  "from": "TRY",
  "to": {
    "JPY": 18.6663465578
  }
}
```

## 2. Average Exchange Rate API

### 2.1. URL

/api/exchangerate/avg

### 2.2. Parameters

- **from**: Symbol of the base currency. Examples: `EUR`, `USD`, `TRY`
- **to**: Symbol of the currency to be converted. Examples: `EUR`, `USD`, `TRY`
- **start_date**: The date to start the average calculation from. In YYYY-MM-DD format.
- **end_date**: The date to end the average calculation. In YYYY-MM-DD format.
- **format**: This is return format. It can be 'json' or 'html'. If you set this to 'json', it will return a JSON object. Otherwise, it will return a HTML page which shows the values.

> - from parameter is optional. When it is not given, it will be assumed as `TRY`.
> - start_date parameter is optional. When it is not given, it will be assumed as 7 days before current date.
> - end_date parameter is optional. When it is not given, it will be assumed as current date.


### 2.3. Return Format

```
{
  "from": FROM-PARAMETER,
  "to": TO-PARAMETER,
  "start_date": START_DATE-PARAMETER,
  "end_date": END_DATE-PARAMETER,
  "average": AVERAGE-PARAMETER
}
```

**Example**

```
{
  "from":"USD",
  "to":"TRY",
  "start_date":"2019-04-28",
  "end_date":"2019-05-05",
  "average":5.960330369399999
}
```

### 2.4. Request Type

Only `GET` allowed.

### 2.5. Examples

**Request**
```
GET example.com/api/exchangerate/avg?from=EUR&to=TRY&start_date=2019-05-01&end_date=2019-05-05&format=json
```

**Response**
```
{
  "from":"EUR",
  "to":"TRY",
  "start_date":"2019-05-01",
  "end_date":"2019-05-05",
  "average":6.6758
}
```

**Request**
```
GET example.com/api/exchangerate/avg?from=EUR&to=AUD&start_date=&end_date=&format=json
```

**Response**

```
{
  "from":"EUR",
  "to":"AUD",
  "start_date":
  "2019-04-28",
  "end_date":"2019-05-05",
  "average":1.5912250000000001
}
```

**Request**
```
GET example.com/api/exchangerate/avg?from=TRY&to=EUR&start_date=2019-04-09&end_date=2019-05-19&format=html
```

**Response**
![Screenshot from 2019-05-05 22-55-01](https://user-images.githubusercontent.com/23139429/57199580-66f44d00-6f89-11e9-9a7c-32696670acd0.png)


## 3. Stock Indexes API

### 3.1. URL

/stock

### 3.2. Parameters

- **function**: The time series of choice. The following values are supported: `TIME_SERIES_INTRADAY`, `TIME_SERIES_DAILY`, `TIME_SERIES_DAILY_ADJUSTED`, `TIME_SERIES_WEEKLY`, `TIME_SERIES_WEEKLY_ADJUSTED`, `TIME_SERIES_MONTHLY`, `TIME_SERIES_MONTHLY_ADJUSTED`, `TRY`
- **symbol**: The name of the stock index. Examples: `MSFT`
- **interval**: Time interval between two consecutive data points in the time series.The following values are supported: `1min`,`5min`,`15min`,`30min`,`60min` 

> `function` and `symbol` parameters is required. `interval` parameter is requeired only when `function=TIME_SERIES_INTRADAY`

### 3.3. Return Format

```
{
    "Meta Data": {
        "1. Information": GENERAL INFORMATION ABOUT RESPONSE SUCH AS FIELDS ETC.,
        "2. Symbol": SYMBOL PARAMATER,
        "3. Last Refreshed": LAST REFRESH TIME OF DATA,
        "4. Interval": INTERVAL PARAMETER IF GIVEN,
        "5. Output Size": Compact IS DEFAULT OUTPUT SIZE. Compact RETURNS ONLY THE LATEST 100 DATA POINTS IN THE INTRADAY TIME SERIES,
        "6. Time Zone": "US/Eastern" IS TIME ZONE OF LAST REFRESHED FIELD
    },
    TIME SERIES: {
        TIME: {
            "1. open": OPEN VALUE,
            "2. high": HIGH VALUE,
            "3. low": LOW VALUE,
            "4. close": CLOSE VALUE,
            "5. volume": VOLUME VALUE
        },
}
```
### 3.4. Request Type

Only `GET` allowed.

### 3.5. Examples

**Request**
```
GET example.com/stock?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min
```

**Response**
```
{
    "Meta Data": {
        "1. Information": "Intraday (5min) open, high, low, close prices and volume",
        "2. Symbol": "MSFT",
        "3. Last Refreshed": "2019-05-03 16:00:00",
        "4. Interval": "5min",
        "5. Output Size": "Compact",
        "6. Time Zone": "US/Eastern"
    },
    "Time Series (5min)": {
        "2019-05-03 16:00:00": {
            "1. open": "128.9200",
            "2. high": "129.0400",
            "3. low": "128.8000",
            "4. close": "128.8900",
            "5. volume": "1163055"
        },
        "2019-05-03 15:55:00": {
            "1. open": "128.9300",
            "2. high": "128.9700",
            "3. low": "128.8600",
            "4. close": "128.9150",
            "5. volume": "373828"
        },
        ...
}
```

**Request**
```
GET example.com/stock?function=TIME_SERIES_DAILY&symbol=MSFT
```

**Response**

```
{
    "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "MSFT",
        "3. Last Refreshed": "2019-05-03",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2019-05-03": {
            "1. open": "127.3600",
            "2. high": "129.4300",
            "3. low": "127.2500",
            "4. close": "128.9000",
            "5. volume": "24911126"
        },
        "2019-05-02": {
            "1. open": "127.9800",
            "2. high": "128.0000",
            "3. low": "125.5200",
            "4. close": "126.2100",
            "5. volume": "27350161"
        },
        ...
}
```
