# Eventshuffle backend API

## run eventshuffle in local guide

-> latest version of node
-> Monogdb compass in local running on port = 27017 (it should be by default)
-> clone this git
-> npm install
-> npm run dev

## Postman API collection to save time

https://www.postman.com/DominicKashyap/workspace/event-open-apis

## List all events

Endpoint: `/api/v1/event/list`

### Request

Method: `GET`

### Response

Body:

```
{
  "events": [
    {
      "id": 0,
      "name": "Jake's secret party"
    },
    {
      "id": 1,
      "name": "Bowling night"
    },
    {
      "id": 2,
      "name": "Tabletop gaming"
    }
  ]
}
```

## Create an event

Endpoint: `/api/v1/event`

### Request

Method: `POST`

Body:

```
{
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ]
}
```

### Response

Body:

```
{
  "id": 0
}
```

## Show an event

Endpoint: `/api/v1/event/{id}`

### Request

Method: `GET`

Parameters: `id`, `long`

### Response

Body:

```
{
  "id": 0,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy"
      ]
    }
  ]
}
```

## Add votes to an event

Endpoint: `/api/v1/event/{id}/vote`

### Request

Method: `POST`

Parameters: `id`, `long`

Body:

```
{
  "name": "Dick",
  "votes": [
    "2014-01-01",
    "2014-01-05"
  ]
}
```

### Response

```
{
  "id": 0,
  "name": "Jake's secret party",
  "dates": [
    "2014-01-01",
    "2014-01-05",
    "2014-01-12"
  ],
  "votes": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    },
    {
      "date": "2014-01-05",
      "people": [
        "Dick"
      ]
    }
  ]
}
```

## Show the results of an event

Endpoint: `/api/v1/event/{id}/results`
Responds with dates that are **suitable for all participants**.

### Request

Method: `GET`

Parameters: `id`, `long`

### Response

```
{
  "id": 0,
  "name": "Jake's secret party",
  "suitableDates": [
    {
      "date": "2014-01-01",
      "people": [
        "John",
        "Julia",
        "Paul",
        "Daisy",
        "Dick"
      ]
    }
  ]
}
```
