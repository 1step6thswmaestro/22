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
def nounExtractor(content):
    """
    Extract only 일반 명사 and 고유 명사
    """
    words = []
    node = m.parseToNode(content.encode('utf-8'));
    while(node!=None):
        result = node.feature.split(',')

        if result[0] == 'NNG' or result[0] == 'NNP':
            words.append(node.surface)

        node = node.next
    return words

def verbExtractor(content):
    """
    Extract only 동사
    """

    words = []
    node = m.parseToNode(content.encode('utf-8'));
    while(node!=None):
        result = node.feature.split(',')

        if result[0] == 'VV':
            words.append(node.surface)

        node = node.next
    return words

def getNounAndVerb(content):
    words = nounExtractor(content) + verbExtractor(content)
    return words

def main():
    import sys
    import json

    result = {}
    try:
        result["tokens"] = getNounAndVerb(sys.argv[1])
    except:
        with open('errlog.txt', 'w') as f:
            f.write(sys.exc_info()[0])
        sys.exit(1);

    print json.dumps(result)
    sys.exit(0)

if __name__ == "__main__":
    main()
