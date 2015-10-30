#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
reload(sys) # Encoding trick. Suppress encoding error when we pass Korean as sys.argv
sys.setdefaultencoding("utf-8")

import MeCab
m = MeCab.Tagger() # User default dictionary.
# m = MeCab.Tagger('-d /usr/lib/mecab/dic/mecab-ko-dic')
# Below code is requied to run to prevent a odd bug.
# The bug seems like MeCab but. When we parse for the first time, parse didn't work.
m.parse(u'한국어의 형태소를 분리하는지 테스트'.encode('utf-8'))

# You can find tag information here.
# https://docs.google.com/spreadsheet/ccc?key=0ApcJghR6UMXxdEdURGY2YzIwb3dSZ290RFpSaUkzZ0E&usp=sharing

import re

def log(var, indent = 0):
    import json
    space = ' ' * indent;

    print space, json.dumps(var, ensure_ascii=False)

# You can find tag information here.
# https://docs.google.com/spreadsheet/ccc?key=0ApcJghR6UMXxdEdURGY2YzIwb3dSZ290RFpSaUkzZ0E&usp=sharing
def extractor(content):
    """
    Extract key morphemes
    """
    words = []
    node = m.parseToNode(content.encode('utf-8'));
    mytags = ['NNG', 'NNP', 'VV', 'VA', 'MM', 'SL', 'XR']
    while(node!=None):
        result = node.feature.split(',')
        # log(result, 4)

        if result[0] in mytags:
            words.append(node.surface)
        else:
            if result[0].find('+') is not -1:
                # Use regex to extract key words
                for tag in mytags:
                    pattern = '([^/]+)/'+tag+'/'
                    # print 'pattern?:', pattern
                    match = re.search(pattern, result[-1])
                    if match is not None:
                        words.append(match.group(1))

                pass
        node = node.next
    return words


def main():
    import sys
    import json

    result = {}
    try:
        result["tokens"] = extractor(sys.argv[1])
    except:
        with open('errlog.txt', 'w') as f:
            f.write(sys.exc_info()[0])
        sys.exit(1);

    print json.dumps(result)
    sys.exit(0)

if __name__ == "__main__":
    main()
