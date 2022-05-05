# Config

## WASM dependency

The core logic of this app is in a WASM binary. You just have to download it and place it such that the react app can find it:

1. Download

Go to [releases](https://github.com/ivanschuetz/capi-react/releases) and download a (usually most recent) zip.

2. Unzip

Unzip the downloaded file and put it next to your clone of this repo, so it looks like this:

```
react (or however you named it)
wasm-build (unzipped directory)
```

## Start

In the react directory:

The first time, install dependencies:

```
npm install
```

Now you just have to start the app:

```
npm start --debug
```

Navigate to http://localhost:3000 in your browser.
