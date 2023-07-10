var climajsonlocationExtended={
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id":"http://www.eco-envolventes.net/climaschema/climaJSONlocationExtended.json#",
    "title": "clima JSON extended location object",
    "description": "extended location description",
    "type": "object",
    "properties":{
            "country":{
            "description": "Country name",
            "type": "string"
            },
        "dataDescription":{
            "description": "description of the data",
            "type": "string"
            },
        "wmo":{
            "description": "World Meteorological Organization Station Number",
            "type": "string"
            },
        "timeZone":{
            "description": "units hours",
            "type": "number",
            "minimum": -12,
            "maximum": 12
            },
        "source":{
            "description": "Data source",
            "type": "string"
            },
        "startDay":{
            "description": "start day of hourly data",
            "type": "array",
            "items":[
                {
                    "type":"number"
                    },
                {
                    "type":"string",
                    "enum": ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
                    }
                ]
            },
        "endDay":{
            "description": "end day of hourly data",
            "type": "array",
            "items":[
                {
                    "type":"number"
                    },
                {
                    "type":"string",
                    "enum": ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
                    }
                ]
            },

        "start of week":{
            "description": "first day of week",
            "type": "string",
            "enum": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            }
        }
    }