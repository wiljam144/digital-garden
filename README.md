# Wiljam's Digital Garden

<img
    src="./repo/logo.png"
    width="250" height="250"
/>

This repository contains code and sources for my
[Digital Garden](https://wiljam144.github.io/digital-garden)
including the build system written in JS.

I created this project as a way to organize my notes and knowledge,
inspired by websites like [Gwern.net](https://gwern.net/).
On top of that, creating my own build system was a fun weekend project,
parts of which should be documented somewhere in this Garden.

## Atom RSS Feed

<a href="http://validator.w3.org/check.cgi?url=https%3A//wiljam144.github.io/digital-garden/rss.xml">
<img src="./repo/valid-atom.png" alt="[Valid Atom 1.0]" title="Validate my Atom 1.0 feed" /></a><br><br>

The RSS feed that is updated monthly with changelog
is available [here](https://wiljam144.github.io/digital-garden/rss.xml)

## Running
If you, for some reason want to browse this website locally:
1. Install dependencies
`npm install`
2. Compile markdown into html
`npm run build`
3. Run webserver
`npm run start`

## Validation

There's also a validation script. I use it for finding typos, dead links and grammar errors.
Right now it's painfully slow due to it analyzing every word in the notes and every sentence.
To run it use `npm run validate`.

Note that you need to have python3 installed.
Also, some paths might be broken because GitHub Pages requires me to fetch from
`digital-garden/<path>` instead of just `/<path>`.

You can use code and text from here,
under the condition that you give me attribution.
(Wiljam Holmes (wiljam1444@gmail.com)).
