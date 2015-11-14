#!/usr/bin/python
# -*- coding: utf-8 -*-

import batchTimePrefScore as calc
import logging

logging.basicConfig(level=logging.DEBUG, filename='./pythonGetTokenScore.log')

def main():
    import sys
    import json
    # logging.info(sys.argv)

    from pymongo import MongoClient
    from bson.objectid import ObjectId
    # Improvement Note: Load db config from config/config.json. 
    db_addr='172.16.101.172'
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
        logging.exception("Oops:")
        sys.exit(1);

    output = json.dumps(result)
    # logging.info(output)
    print output
    sys.exit(0)

if __name__ == "__main__":
    main()
