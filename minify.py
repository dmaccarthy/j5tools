#!python3

import requests
from sys import argv

def jsMin(fn):
    with open(fn, "rb") as f:
        print(fn, end="... ")
        data = {"input": f.read()}
        resp = requests.post("https://javascript-minifier.com/raw", data=data)
        print("Minified!")
    return resp.text

def jsMax(fn):
    with open(fn, "r") as f: return f.read()

def main():
    with open("fileList.txt") as f:
        jsFiles = [js.strip() for js in f]
    with open("j5tools-min.js", "w") as f:
        for js in jsFiles:
            minFunc = jsMax if "--no_min" in argv else jsMin
            f.write(minFunc(js))

main()
