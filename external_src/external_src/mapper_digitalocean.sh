curl -XPUT http://localhost:9200/givemetask -d '
{
    "mappings" : {
        "articles" : {
            "dynamic" : false,
            "properties" : {
                "__v" : { "type" : "long"},
                "originId" : {
                    "type" : "string",
                    "index" : "not_analyzed"
                },
                "summary" : { "type" : "string" },
                "title" : { "type" : "string" },
                "userId" : {
                    "type" : "string",
                    "index" : "not_analyzed"
                }
            }
        }
    }
}';
