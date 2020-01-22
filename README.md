# Utility Functions For Use with Math.random

This is the code distribution for the Medium article _Some Random Thoughts_.

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 3.4.5

Jest: 24.9.0

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. npm test (it really should not be this easy, but it is)

2. Standalone compilation only (npm build)

Specs (random.spec.ts) reside in the ___tests___ folder.


### Introduction

This repo contains a small number of Typescript utilities for dealing with computations involving random processes, some of which were moved over from the _Typescript Math Toolkit_.  The following classes/functions are provided,

- TSMT$RandomIntInRange
- TSMT$Bin
- TSMT$Deviates
- SeededRng
- fisher-yates

Usage and API are covered in the _Medium_ article.

Specs, written in _jest_, provide additional usage examples.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

