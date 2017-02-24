#!python3

import requests

def jsMin(fn):
    with open(fn, "rb") as f:
        print(fn, end="... ")
        data = {"input": f.read()}
        resp = requests.post("https://javascript-minifier.com/raw", data=data)
        print("Minified!")
    return resp.text

def main():
    with open("fileList.txt") as f:
        jsFiles = [js.strip() for js in f]
    with open("j5tools-min.js", "w") as f:
        for js in jsFiles:
            f.write(jsMin(js))

main()
