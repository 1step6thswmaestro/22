curl -XPUT 'http://localhost:9200/_river/mongodb/_meta' -d '{ 
    "type": "mongodb", 
    "mongodb": { 
        "host" : "128.199.166.149",
        "port" : 27340,
        "db": "test",
        "collection": "articles",    
        "options" :{
            "secondary_read_preference" : true
        }
    },
    "index": { 
        "name": "givemetask",
        "type": "articles" 
    }
}'
