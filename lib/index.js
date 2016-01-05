import rest from 'rest'
import pathPrefix from 'rest/interceptor/pathPrefix'
import defaultRequest from 'rest/interceptor/defaultRequest'
import mime from 'rest/interceptor/mime'
import WebSocket from 'ws'

// module.exports used for better compatibility with non-es6 js users
module.exports = class StockFighterAPI {
  constructor (options) {
    this.apiKey = options.apiKey
    this.baseWebsocketUrl = 'wss://api.stockfighter.io/ob/api/ws'
    this.baseRestUrl = 'https://api.stockfighter.io/ob/api/'
    this.baseGameMasterUrl = 'https://www.stockfighter.io/gm'

    this.client = rest
      .wrap(pathPrefix, { prefix: this.baseRestUrl })
      .wrap(defaultRequest, {
        headers: { 'X-Starfighter-Authorization': this.apiKey } })
      .wrap(mime, { mime: 'application/json' })

    this.gameMaster = rest
      .wrap(pathPrefix, { prefix: this.baseGameMasterUrl })
      .wrap(defaultRequest, {
        headers: { 'X-Starfighter-Authorization': this.apiKey } })
      .wrap(mime, { mime: 'application/json' })

    if (options.account) {
      this.account = options.account
    } else {
      this.account = null
    }
  }

  /**
   * Check whether the API is online
   * @return {Object} response entity
   */
  heartbeat () {
    return this.client({ path: 'heartbeat' })
               .then(res => { return res.entity })
  }

  /**
   * Check whether a stock exchange is online
   * @param {Object} options
   * @param {String} options.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venueHeartbeat (options) {
    return this.client({
      path: `venues/${options.venue}/heartbeat`
    }).then(res => { return res.entity })
  }

  /**
   * Get all venues on the stock exchange
   * @return {Object} response entity
   */
  venues () {
    return this.client({
      path: `venues`
    }).then(res => { return res.entity })
  }

  /**
   * Get all stocks in a specific exchange
   * @param {Object} options
   * @param {String} options.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venueStocks (options) {
    return this.client({
      path: `venues/${options.venue}/stocks`
    }).then(res => { return res.entity })
  }

  /**
   * Get the orderbook for a specific stock
   * @param {Object} options
   * @param {String} options.venue - symbol for stock exchange
   * @param {String} options.stock - symbol for stock
   * @return {Object} response entity
   */
  orderbook (options) {
    return this.client({
      path: `venues/${options.venue}/stocks/${options.stock}`
    }).then(res => { return res.entity })
  }

  /**
   * Buy a stock
   * @param  {Object} options
   * @param  {String} options.account - bank account used to purchase
   * @param  {String} options.venue - symbol for stock exchange
   * @param  {String} options.stock - symbol for stock to buy
   * @param  {Integer|String} options.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} options.quantity - number of shares to buy
   * @param  {String} options.type - type of order, can be 'limit', 'market',
   *                            	'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  buy (options) {
    if (!this.account && !options.account) {
      throw 'Account ID must be specified'
    }
    let opts = {
      account: this.account || options.account,
      direction: 'buy',
      orderType: options.type,
      qty: options.quantity
    }

    if (options.price) {
      opts.price = parseInt(options.price.toString().replace('.', ''), 10)
    }

    return this._order(options.venue, options.stock, opts)
  }

  /**
   * Sell a stock
   * @param  {Object} options
   * @param  {String} options.account - bank account used to purchase
   * @param  {String} options.venue - symbol for stock exchange
   * @param  {String} options.stock - symbol for stock to sell
   * @param  {Integer|String} options.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} options.quantity - number of shares to sell
   * @param  {String} options.type - type of order, can be 'limit', 'market',
   *                            	'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  sell (options) {
    if (!this.account && !options.account) {
      throw 'Account ID must be specified'
    }
    let opts = {
      account: this.account || options.account,
      direction: 'sell',
      orderType: options.type,
      qty: options.quantity
    }

    if (options.price) {
      opts.price = parseInt(options.price.toString().replace('.', ''), 10)
    }

    return this._order(options.venue, options.stock, opts)
  }

  /**
   * Order a stock
   * @private
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to order
   * @param {Object} opts - see buy and sell docs
   * @return {Object} response entity
   */
  _order (venue, stock, options) {
    return this.client({
      path: `venues/${venue}/stocks/${stock}/orders`,
      method: 'post',
      entity: options
    }).then(res => { return res.entity })
  }

  /**
   * Get a quote for a stock's price
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to quote
   * @return {Object} response entity
   */
  quote (options) {
    return this.client({
      path: `venues/${options.venue}/stocks/${options.stock}/quote`
    }).then(res => { return res.entity })
  }

  orderStatus (options) {
    return this.client({
      path: `venues/${options.venue}/stocks/${options.stock}/orders/${options.id}`
    }).then(res => { return res.entity })
  }

  cancelOrder (options) {
    return this.client({
      path: `venues/${options.venue}/stocks/${options.stock}/orders/${options.id}`,
      method: 'delete'
    }).then(res => { return res.entity })
  }

  allOrders (options) {
    let pathConfig = options.stock
    ? `venues/${options.venue}/accounts/${options.account}/stocks/${options.stock}/orders`
    : `venues/${options.venue}/accounts/${options.account}/orders`

    return this.client({
      path: pathConfig
    }).then(res => { return res.entity })
  }

  startLevel (level) {
    return this.gameMaster({
      path: '/levels/' + level,
      method: 'post',
    }).then(res => {
      this.setAccount(res.entity.account)
      return res.entity
    })
  }

  restartLevel (instanceId) {
    return this.gameMaster({
      path: '/instances/' + instanceId + '/restart',
      method: 'post',
    }).then(res => {
      this.setAccount(res.entity.account)
      return res.entity
    })
  }

  stopLevel (instanceId) {
    return this.gameMaster({
      path: '/instances/' + instanceId + '/stop',
      method: 'post',
    }).then(res => { return res.entity })
  }

  resumeLevel (instanceId) {
    return this.gameMaster({
      path: '/instances/' + instanceId + '/resume',
      method: 'post',
    }).then(res => {
      this.setAccount(res.entity.account)
      return res.entity
    })
  }

  levelStatus (instanceId) {
    return this.gameMaster({
      path: '/instances/' + instanceId
    }).then(res => { return res.entity })
  }

  getInstructions (level) {
    var instructions;
    return this.startLevel(level).then(instance => {
      instructions = instance.instructions
      return this.stopLevel(instance.instanceId)
    }).then(() => {
      return instructions
    })
  }

  websocket (options) {
    if (!this.account) {
      throw 'Cannot open websocket. Account ID is not defined.'
    }
    let type = options.type === 'executions' ? '/executions' : '/tickertape'
    let venue = options.venue ? '/venues/' + options.venue : ''
    let stock = options.stock ? '/stocks/' + options.stock : ''
    let url = this.baseWebsocketUrl + '/' + this.account + venue + type + stock;
    var ws = new WebSocket(url)
    if (options.onOpen) {
      ws.on('open', function open(data) {
          options.onOpen({
            data: JSON.parse(data)
          })
      })
    }
    if (options.onMessage) {
      ws.on('message', function message(data, flags) {
          options.onMessage({
            data: JSON.parse(data),
            flags: flags
          })
      })
    }
    if (options.onClose) {
      ws.on('close', function close(data) {
        options.onClose({
          data: JSON.parse(data)
        })
        if (options.reconnect) {
          this.websocket(options, callback)
        }
      })
    }
    if (options.onError) {
      ws.on('error', function error(data) {
        options.onError({
          data: JSON.parse(data)
        })
      })
    }
    return ws;
  }

  tickertape (options) {
    options.type = 'tickertape'
    return this.websocket(options)
  }

  executions (options) {
    options.type = 'executions'
    return this.websocket(options)
  }

  setAccount (account) {
    this.account = account
  }
}
