'''

'''

import sys
import argparse

#getting audio from computer logic
#getting ASR output
#getting MT output





if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="SLT-pipeline processing")
    parser.add_argument("-i", "--input", help="Input speech file name")
    parser.add_argument("-o", "--output", help="Output speech file name")
    args = parser.parse_args()

    if args.input and args.output:
        input = args.input
        output = args.output
    else:
        raise Exception("No input with output selection")
