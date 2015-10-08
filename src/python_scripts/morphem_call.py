#!usr/bin/python
from konlpy.tag import Mecab
import sys
import json

def main():
	mecab = Mecab()
	if len(sys.argv) < 2:
		result = {'result':'none'}
		print json.dumps(result)
    else:
	    morphem_list = mecab.pos(sys.argv[1].decode('utf-8'))
	    result_dict = {}
	    result_dict['result'] = [x[0].encode('utf-8') for x in morphem_list]
	    print json.dumps(result_dict)

if __name__=='__main__':
	main()
