# Introduction

Eventshuffle is an application to help scheduling events with friends, quite like http://doodle.com/ but in a much simplified way. An event is created by posting a name and suitable dates to the backend, events can be queried from the backend and participants can submit dates suitable for them.

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js**: The latest version of Node.js.
- **MongoDB Compass**: Ensure MongoDB is running locally on port `27017` (this is the default port).

## Getting Started

Follow these steps to get the project running on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Pkkashyap/Eventshuffle-backend-API.git
   cd Eventshuffle backend API
   ```

2. **Install Dependencies**

   ```bash
   npm install

   ```

3. **Start the Development Server**

   ```bash
   npm run dev

   ```

4. **Start the Development Server**
   Open your browser and navigate to http://localhost:5001 (or the port specified in your environment configuration) to start using Eventshuffle.

## Use Cases

Create Event:

A user wants to create a new event by providing a name and a list of potential dates. The system checks for existing events with the same name and validates the date format. If the event is unique, it is saved, and a unique event ID is returned.

List Events:

A user requests to see a list of all available events. The system retrieves and displays the names and IDs of all events in the database, allowing users to choose an event to view or manage.

View Event Details:

A user selects an event by its ID to view detailed information, including the event's name, the proposed dates, and the list of votes for each date. If the event exists, the system returns the details; otherwise, it returns an error indicating the event is not found.

Add Vote to Event:

A participant selects an event and submits their preferred dates. The system validates the dates against the event's available dates, adds the participant's vote, and updates the event's vote tally accordingly.

View Event Results:

A user requests the results for a specific event, where the system analyzes votes to identify dates that are suitable for all participants. The system returns a list of these suitable dates or informs the user if no common dates were found.

## Responses

## List all events

```http
GET /api/v1/event/list
```

Response

```javascript
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

```http
POST /api/v1/event/list
```

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

| Parameter | Type       | Description  |
| :-------- | :--------- | :----------- |
| `name`    | `string`   | **Required** |
| `dates`   | `string[]` | **Required** |

Response

```javascript
{
  "id": 66d445e46de3486087f2123e
}
```

## Show an event

```http
GET /api/v1/event/{id}
```

| Parameter | Type   | Description  |
| :-------- | :----- | :----------- |
| `id`      | `long` | **Required** |

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

## Add votes to an event

```http
POST /api/v1/event/{id}/vote
```

| Parameter | Type       | Description  |
| :-------- | :--------- | :----------- |
| `id`      | `long`     | **Required** |
| `name`    | `string`   | **Required** |
| `dates`   | `string[]` | **Required** |

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

Responds with dates that are **suitable for all participants**.

```http
GET /api/v1/event/{id}/results
```

| Parameter | Type   | Description  |
| :-------- | :----- | :----------- |
| `id`      | `long` | **Required** |

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

## Status Codes

Events API returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |
