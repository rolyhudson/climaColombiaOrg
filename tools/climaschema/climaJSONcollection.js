//this format supports: a range of years at one location
//a single year at multiple locations, 
//or multiple years at multiple locations
var climajsoncollection={
	"$schema": "http://json-schema.org/draft-04/schema#",
	"id":"http://www.eco-envolventes.net/climaschema/climaJSONcollection.json#",
    "title": "clima JSON object",
    "description": "schema for clima JSON object",
    "type": "object",
	"properties":{
		"collectionType":{
			"description": "describe the type of collection",
			"type":"string"
			},
		"startYear":{
			"description": "start year or year if not a collection of years",
			"type":"integer"
			},
		"endYear":{
			"description": "end year",
			"type":"integer"
			},
		"climate data":{
			"description": "collection of climaJSON objects",
            "type": "array",
            "items":{
            	"description": "climaJSON objects",
                "$ref": "http://eco-envolventes.org/climaschema/climaJSON.json"
            	}
			},
		"required":["climate data"]
	}
}
