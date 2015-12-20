import rest from 'rest'
import pathPrefix from 'rest/interceptor/pathPrefix'
import defaultRequest from 'rest/interceptor/defaultRequest'
import mime from 'rest/interceptor/mime'

// module.exports used for better compatibility with non-es6 js users
module.exports = class StockFighterAPI {
  constructor (options) {
    this.apiKey = options.apiKey

    this.client = rest
      .wrap(pathPrefix, { prefix: 'https://api.stockfighter.io/ob/api/' })
      .wrap(defaultRequest, { headers: { 'X-Starfighter-Authorization': this.apiKey } })
      .wrap(mime, { mime: 'application/json' })
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
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venue_heartbeat (opts) {
    return this.client({
      path: `venues/${opts.venue}/heartbeat`
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
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @return {Object} response entity
   */
  venue_stocks (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks`
    }).then(res => { return res.entity })
  }

  /**
   * Get the orderbook for a specific stock
   * @param {Object} opts
   * @param {String} opts.venue - symbol for stock exchange
   * @param {String} opts.stock - symbol for stock
   * @return {Object} response entity
   */
  orderbook (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}`
    }).then(res => { return res.entity })
  }

  /**
   * Buy a stock
   * @param  {Object} opts
   * @param  {String} opts.account - bank account used to purchase
   * @param  {String} opts.venue - symbol for stock exchange
   * @param  {String} opts.stock - symbol for stock to buy
   * @param  {Integer|String} opts.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} opts.quantity - number of shares to buy
   * @param  {String} opts.type - type of order, can be 'limit', 'market',
   *                            	'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  buy (opts) {
    let options = {
      account: opts.account,
      direction: 'buy',
      orderType: opts.type,
      qty: opts.quantity
    }

    if (opts.price) {
      options.price = parseInt(opts.price.toString().replace('.', ''), 10)
    }

    return this._order(opts.venue, opts.stock, options)
  }

  /**
   * Sell a stock
   * @param  {Object} opts
   * @param  {String} opts.account - bank account used to purchase
   * @param  {String} opts.venue - symbol for stock exchange
   * @param  {String} opts.stock - symbol for stock to sell
   * @param  {Integer|String} opts.price - Desired price, ex. 50.42 == $50.42
   * @param  {Integer|String} opts.quantity - number of shares to sell
   * @param  {String} opts.type - type of order, can be 'limit', 'market',
   *                            	'fill-or-kill', 'immediate-or-cancel'
   * @return {Object} response entity
   */
  sell (opts) {
    let options = {
      account: opts.account,
      direction: 'sell',
      orderType: opts.type,
      qty: opts.quantity
    }

    if (opts.price) {
      options.price = parseInt(opts.price.toString().replace('.', ''), 10)
    }

    return this._order(opts.venue, opts.stock, options)
  }

  /**
   * Order a stock
   * @private
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to order
   * @param {Object} options - see buy and sell docs
   * @return {Object} response entity
   */
  _order (venue, stock, opts) {
    return this.client({
      path: `venues/${venue}/stocks/${stock}/orders`,
      method: 'post',
      entity: opts
    }).then(res => { return res.entity })
  }

  /**
   * Get a quote for a stock's price
   * @param {String} venue - symbol for stock exchange
   * @param {String} stock - symbol for stock to quote
   * @return {Object} response entity
   */
  quote (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/quote`
    }).then(res => { return res.entity })
  }

  order_status (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/orders/${opts.id}`
    }).then(res => { return res.entity })
  }

  cancel_order (opts) {
    return this.client({
      path: `venues/${opts.venue}/stocks/${opts.stock}/orders/${opts.id}`,
      method: 'delete'
    }).then(res => { return res.entity })
  }

  all_orders (opts) {
    let pathConfig = opts.stock
    ? `venues/${opts.venue}/accounts/${opts.account}/stocks/${opts.stock}/orders`
    : `venues/${opts.venue}/accounts/${opts.account}/orders`

    return this.client({
      path: pathConfig
    }).then(res => { return res.entity })
  }

}
