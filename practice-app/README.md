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

> from parameter is optional. When it is not given, it will be assumed as `TRY`.
> start_date parameter is optional. When it is not given, it will be assumed as 7 days before current date.
> end_date parameter is optional. When it is not given, it will be assumed as current date.


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
GET example.com/api/exchangerate/avg?from=EUR&to=TRY&start_date=2019-05-01&end_date=2019-05-05
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
GET example.com/api/exchangerate/avg?from=EUR&to=AUD&start_date=&end_date=
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
