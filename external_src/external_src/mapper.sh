curl -XPUT http://localhost:9200/givemetask -d '
{
    "mappings" : {
        "articles" : {
            "dynamic" : false,
            "properties" : {
                "title" : {"type" : "string"},
                "content" : {"type" : "string"},
                "summary" : {"type" : "string"},
                "updated" : {"type" : "string"},
                "master_feed" : {"type" : "string", "index" : "not_analyzed"}
            }
        }
    }
}';
