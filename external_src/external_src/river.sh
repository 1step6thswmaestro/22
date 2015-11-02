curl -XPUT 'http://localhost:9200/_river/mongodb/_meta' -d '{ 
    "type": "mongodb", 
    "mongodb": { 
        "host" : "127.0.0.1",
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
