# Stockfighter Node

[![npm](http://img.shields.io/npm/v/stockfighter.svg?style=flat)](https://badge.fury.io/js/stockfighter) [![tests](http://img.shields.io/travis/jenius/stockfighter-node/master.svg?style=flat)](https://travis-ci.org/jenius/stockfighter-node)
[![dependencies](https://gemnasium.com/jenius/stockfighter-node.svg?style=flat)](https://gemnasium.com/jenius/stockfighter-node)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

A simple and clean API wrapper for the [Stockfighter](https://www.stockfighter.io/) game.

### Installation

`npm i stockfighter -S`

### Usage

This library exports a class which you must initialize with an API key in order to use, as such:

```js
import 'API' from 'stockfighter'

let client = new API({ apiKey: 'xxx' });
```

Once you have initialized the client, you can call any of the following methods to get back the API response. All responses are returned as promises, because I like promises and the are a much better way to handle asynchronous control flow than callbacks. If you don't use promises, this is ok, they are very easy to handle and can be treated pretty much the same as callbacks if you decide not to use their extra power. A simple example is given below:

```js
client.heartbeat()
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });
```

### Methods

Any method that takes parameters only accepts an object with the options set as key/value pairs. All methods that take options objects are documented fully along with the option names, types, and descriptions below.

#### client.heartbeat()
Checks if the API is online. ([official docs](https://starfighter.readme.io/docs/heartbeat))

#### client.venue(options)
Checks if a stock exchange is online. ([official docs](https://starfighter.readme.io/docs/venue-healthcheck))

##### Options
- **venue** (String): symbol for stock exchange

#### client.venues()
Returns a list of all venues offered by the stock exchange. (unofficial)

##### Options
- None

#### client.venueStocks(options)
Returns a list of stocks offered by a stock exchange. ([official docs](https://starfighter.readme.io/docs/list-stocks-on-venue))

##### Options
- **venue** (String): symbol for stock exchange

#### client.orderbook(options)
Gets the order book for a specific stock. ([official docs](https://starfighter.readme.io/docs/get-orderbook-for-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock

#### client.buy(options)
Purchases a specific stock. ([official docs](https://starfighter.readme.io/docs/place-new-order))

##### Options
- **account** (String): bank account used to purchase
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **price** (Integer or String) desired price as decimal, ex. 50.42 == $50.42
- **quantity** (Integer or String) number of shares to buy
- **type** (String) type of order, can be 'limit', 'market', 'fill-or-kill', or 'immediate-or-cancel'. See [the docs](https://starfighter.readme.io/docs/place-new-order#order-types) for descriptions of each type.

#### client.sell(options)
Sell a specific stock. ([official docs](https://starfighter.readme.io/docs/place-new-order))

##### Options
- **account** (String): bank account used to purchase
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **price** (Integer or String) desired price as decimal, ex. 50.42 == $50.42
- **quantity** (Integer or String) number of shares to buy
- **type** (String) type of order, can be 'limit', 'market', 'fill-or-kill', or 'immediate-or-cancel'. See [the docs](https://starfighter.readme.io/docs/place-new-order#order-types) for descriptions of each type.

#### client.quote(opts)
Get the most recent trading information for a stock. ([official docs](https://starfighter.readme.io/docs/a-quote-for-a-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock

#### client.orderStatus(opts)
Get the updated status of an existing order. ([official docs](https://starfighter.readme.io/docs/status-for-an-existing-order))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **id** (Integer): id of the order

#### client.cancelOrder(opts)
Cancel an existing order. ([official docs](https://starfighter.readme.io/docs/cancel-an-order))

##### Options
- **venue** (String): symbol for stock exchange
- **stock** (String): symbol for the stock
- **id** (Integer): id of the order

#### client.allOrders(opts)
See all orders in a given account's history ([official docs](https://starfighter.readme.io/docs/status-for-all-orders) and [this too](https://starfighter.readme.io/docs/status-for-all-orders-in-a-stock))

##### Options
- **venue** (String): symbol for stock exchange
- **account** (String): account to view orders for
- **stock** (String): optional - show only orders for this specific stock

### Game Master API

#### client.startLevel(level)
Start a level instance on stockfighter ([unofficial](https://discuss.starfighters.io/t/the-gm-api-how-to-start-stop-restart-resume-trading-levels-automagically/143))

##### Options
- **level** (String): the name of the level to start

#### client.restartLevel(instanceId)
Restart a level instance on stockfighter ([unofficial](https://discuss.starfighters.io/t/the-gm-api-how-to-start-stop-restart-resume-trading-levels-automagically/143))

##### Options
- **instanceId** (Number): the instance ID of the level to restart

#### client.stopLevel(instanceId)
Stop a level instance on stockfighter ([unofficial](https://discuss.starfighters.io/t/the-gm-api-how-to-start-stop-restart-resume-trading-levels-automagically/143))

##### Options
- **instanceId** (Number): the instance ID of the level to stop

#### client.resumeLevel(instanceId)
Resume a level instance on stockfighter ([unofficial](https://discuss.starfighters.io/t/the-gm-api-how-to-start-stop-restart-resume-trading-levels-automagically/143))

##### Options
- **instanceId** (Number): the instance ID of the level to resume

#### client.levelStatus(instanceId)
Check the status of a given level instance ([unofficial](https://discuss.starfighters.io/t/the-gm-api-how-to-start-stop-restart-resume-trading-levels-automagically/143))

##### Options
- **instanceId** (Number): the instance ID of the level

### Websockets

#### client.openWebsocket(options)
Open a websocket for tickertape or executions. Returns the websocket object if you would like to handle it yourself instead of using the options callbacks. (unofficial)

##### Options
- **type** (String): either `tickertape` or `executions`. Defaults to `tickertape`.
- **venue** (String): the venue to filter on. Defaults to none.
- **stock** (String): the stock to filter on. Defaults to none.
- **onOpen** (Function): optional callback for the `open` websocket channel
- **onMessage** (Function): optional callback for the `message` websocket channel
- **onClose** (Function): optional callback for the `close` websocket channel
- **onError** (Function): optional callback for the `error` websocket channel
- **reconnect** (Boolean): will attempt to reconnect the websocket when closed. Defaults to `false`.

#### client.tickertape(options)
Sugar to open a tickertape websocket

#### client.executions(options)
Sugar to open a tickertape websocket

#### client.setAccount(id)
Set your account number before opening a websocket. Your account number is set automatically when starting, resuming, or restarting a level.

### License and Contributing

Any contributions are welcome, just make a pull request! If you want to check and make sure I'm ok with it, just open an issue and ask. Also make sure you add tests, it's very simple to do so and important to keep things in line. In order to get the tests running, you must make a copy of `config.sample.js` and rename it as `config.js`, then add your own API key. Tests are not yet running on travis because I need to do some crazy encryption stuff. I'll do this eventually, in the meantime we will have to be satisfied with locally running tests.

This project is licensed under MIT, and the full license can be found [here](LICENSE.md).
