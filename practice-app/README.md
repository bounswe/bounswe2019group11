A small express app skeleton

Remember to run `npm install`

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
