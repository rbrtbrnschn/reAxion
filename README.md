# reAxion

[![Contributors](https://img.shields.io/github/contributors/rbrtbrnschn/reAxion?color=green)](https://github.com/rbrtbrnschn/reAxion/graphs/contributors)
[![Open Issues](https://img.shields.io/github/issues-raw/rbrtbrnschn/reAxion?color=yellow)](https://github.com/rbrtbrnschn/reAxion/issues)
[![Current Release](https://img.shields.io/github/v/release/rbrtbrnschn/reAxion?color=blue)](https://github.com/rbrtbrnschn/reAxion/releases)

<div style="display: flex; justify-content:center; align-items:center;">
  <img src="https://raw.githubusercontent.com/rbrtbrnschn/reAxion/main/packages/client/public/android-chrome-512x512.png" alt="lightning_bolt" />
</div>



---

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

> 'reAxion is a lightweight and modular ReactJS framework designed to help developers build scalable and maintainable web applications. The framework provides a range of built-in features and tools, making it easier to write high-quality code and increase productivity.' ~ ChatGPT 


## Installation

```
npm i -g nx@latest
npm install
```

## Setup

1. In `./packages/server/` copy the `.env.SAMPLE` to `.env` and adjust parameters. 
2. Run `MONGO_PORT=27017 MONGODB_ROOT_USERNAME=root MONGODB_ROOT_PASSWORD=password docker-compose up -d` in the root directory to 
spin up the mongo db instance.

## Usage

For development purposes.

```
nx run-many --target=serve --parallel --projects=client,server # Running dev environment
nx test core --watch # testing core library
```

## Contributing

Feel free to check out the issues and put in a pr. They are most welcome. 
Leave your feature ideas [here](https://github.com/rbrtbrnschn/reAxion/discussions/50).

## Contributors

<a href="https://github.com/rbrtbrnschn/reAxion/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rbrtbrnschn/reAxion" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## License

![License](https://i.imgflip.com/2mskjg.jpg)
