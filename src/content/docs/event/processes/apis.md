---
title: APIs
description: Event site APIs
editUrl: false
---

## GAS Summary API

Request will contain an array of event names they want stats for (determined in sheets by the close dates in sheets for those events) and an API key (set on the event site side by an ENV variable).

The endpoint is a GET request to `/gas_summary`, so an example request would be `https://kids-up.app.com/gas_summary?events[]=Summer+School&accessKey=12345`.

Needs to return these values for each event at each school which is ongoing or closed less than a month ago, as a hash keyed by event name and school id.

### Seasonal

- School id
- Number of internal
- Number of reservation
- Number of external
- Internal revenue
- Reservation revenue
- External revenue
- Total revenue
- Goal

### Parties

- School id
- Total revenue
- Goal

### Example Request

```json
{
  "events": ["Summer School 2023", "Science Party 2024"],
  "accessKey": "12345"
}
```

### Example Response

- Keyed by event name, then event school ID

```json
{
    "Summer School 2023": [
        {
            "school_id": 2,
            "internal_count": 10,
            "internal_revenue": 100,
            "external_count": 5,
            "external_revenue": 50,
            "reservation_count": 5,
            "reservation_revenue": 50,
            "total_revenue": 150,
            "goal": 200
        },
        ...
    ],
    "Science Party 2024": [
        {
            "school_id": 2,
            "revenue": 200,
            "goal": 300
        },
        ...
    ]
}
```
