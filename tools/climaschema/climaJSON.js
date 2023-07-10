//this format describes an object containing climate data for a single year in a single location 
//The object stores an unlimited set of fields for monthly and / or hourly values.
//most fields are not required see minimal requirements in "required" key
var climajson = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"id":"http://www.eco-envolventes.net/climaschema/climaJSON.json#",
    "title": "clima JSON annual monthly / hourly data object",
    "description": "Hourly and monthly climate data format",
    "type": "object",
	"properties":{
		"name": {
			"description": "City, town, place location name",
            "type": "string"
			},
		"location":{
			"description": "Coordinates of the place lat lon in the geojson format",
            "$ref": "http://json-schema.org/geo"
			},
		"alt":{
			"description": "Altitude in metres above sea level",
            "type": "number",
            "minimum":0
			},
		"year":{
			"description": "Year data was recorded",
            "type": "number"
			},
		"monthlyDataFields" :{
			"description": "Datafields of monthly data",
            "type": "array",
            "items":{
            	"type":{"#ref":"#/definitions/dataField"}
            	},
            "uniqueItems":true
			},
		"monthlyData":{
			"description": "Monthly data each array represents one of the monthly data fields and contains one value for each month of the year",
            "type": "array",
            "items":{
            	"type":"array",
            	"items":{
					"type":"number"
            		},
	            "minItems": 12,
	  			"maxItems": 12
            	}
			},
		"hourlyDataFields":{
			"description": "Datafields of hourly data",
            "type": "array",
            "items":{
            	"type":{"#ref":"#/definitions/dataField"}
            	},
            "uniqueItems":true
			},
		"hourlyData":{
			"description": "Values of hourly data, each array is for one hour of the year and contains values for each of the hourly data fields",
            "type": "array",
            "items":{
            	"type": "array",
            		"items":{
            			"type":"number"
            			}
            	},
            "minItems": 8760,
  			"maxItems": 8760
			},
		"extendedLocationDescription":{
			"description": "extended description for use with data from other formats",
            "$ref": "http://www.eco-envolventes.net/climaschema/climaJSONlocationExtended.json"
			},
		"epwFields":{
			"description": "extended data fields for use with data from epw formats",
            "$ref": "http://www.eco-envolventes.net/climaschema/climaJSONEPWfields.json"
			}
	},
	"definitions":{
		"dataField":{
            "description": "Datafield description",
            "type": "object",
            "properties":{
                "name":{
                    "description": "unique name of field",
                    "type":"string"
                },

                "units":{
                    "description": "measurement units",
                    "type": "string"
                },
                "min":{
                    "description": "minimum expected value",
                    "type": "number"
                },
                "max":{
                    "description": "maximum expected value",
                    "type": "number"
                }
            }
        }
	},
	"oneOf":[
		{"required" : ["location","monthlydatafields","monthlyData"]},
		{"required" : ["location","hourlyDataFields","hourlyData"]},
		{"required" : ["location","monthlydatafields","monthlyData","hourlyDataFields","hourlyData"]}
	]	
}