#!/usr/bin/python
# -*- coding: utf-8 -*-

import batchTimePrefScore as calc

def main():
    import sys
    import json

    from pymongo import MongoClient
    from bson.objectid import ObjectId
    db_addr='localhost' # Assume that this localhost is DB production server.
    db_port=27340

    client = MongoClient(db_addr, db_port)
    db = client.test

    predtokens = db.predicttokens

    result = {}
    try:
        user_id = ObjectId(sys.argv[1])
        tokens = sys.argv[2:]
        score = calc.getTimePrefScore(user_id, predtokens, tokens)
        result["score"] = score
    except:
        with open('errlog.txt', 'w') as f:
            f.write(sys.exc_info()[0])
        sys.exit(1);

    print json.dumps(result)
    sys.exit(0)

if __name__ == "__main__":
    main()
