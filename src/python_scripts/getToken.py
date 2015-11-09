#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
reload(sys) # Encoding trick. Suppress encoding error when we pass Korean as sys.argv
sys.setdefaultencoding("utf-8")

import tokenizer

def main():
    import sys
    import json

    result = {}
    try:
        result["tokens"] = tokenizer.get(sys.argv[1])
    except:
        with open('errlog.txt', 'w') as f:
            f.write(sys.exc_info()[0])
        sys.exit(1);

    print json.dumps(result)
    sys.exit(0)

if __name__ == "__main__":
    main()
