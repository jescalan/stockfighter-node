/* global describe, it */

import API from '..'
import config from './config'

describe('API', () => {
  let api = new API({ apiKey: config.apiKey })

  it('initializes correctly', () => {
    api.should.be.an('object')
    api.should.have.property('apiKey')
    api.should.have.property('client')
  })

  it('GET /heartbeat', () => {
    return api.heartbeat()
      .should.eventually.deep.equal({ ok: true, error: '' })
  })

  it('GET /venues/:venue/heartbeat', () => {
    return api.venue_heartbeat({ venue: 'TESTEX' })
      .should.eventually.deep.equal({ ok: true, venue: 'TESTEX' })
  })

  it('GET /venues/:venue/stocks', () => {
    return api.venue_stocks({ venue: 'TESTEX' })
      .should.eventually.deep.equal({
        ok: true,
        symbols: [
          { name: 'Foreign Owned Occluded Bridge Architecture Resources',
            symbol: 'FOOBAR' }
        ]
      })
  })

  it('GET /venues/:venue/stocks/:stock', () => {
    return api.orderbook({ venue: 'TESTEX', stock: 'FOOBAR' })
      .then(res => {
        res.ok.should.be.true
        res.venue.should.eql('TESTEX')
        res.symbol.should.eql('FOOBAR')
        res.should.have.property('ts')
        res.should.have.property('bids')
        res.should.have.property('asks')
      })
  })

  it('POST /venues/:venue/stocks/:stock/order [buy]', () => {
    return api.buy({
      account: 'EXB123456',
      venue: 'TESTEX',
      stock: 'FOOBAR',
      price: 5142,
      quantity: 10,
      type: 'limit'
    }).then(res => {
      res.ok.should.be.true
      res.venue.should.eql('TESTEX')
      res.symbol.should.eql('FOOBAR')
      res.direction.should.eql('buy')
      res.originalQty.should.eql(10)
      res.price.should.eql(5142)
      res.orderType.should.eql('limit')
      res.account.should.eql('EXB123456')
      res.should.have.property('id')
      res.should.have.property('ts')
      res.should.have.property('fills')
      res.should.have.property('open')
    })
  })

  it('POST /venues/:venue/stocks/:stock/order [sell]', () => {
    return api.sell({
      account: 'EXB123456',
      venue: 'TESTEX',
      stock: 'FOOBAR',
      price: 2375,
      quantity: 3,
      type: 'limit'
    }).then(res => {
      res.ok.should.be.true
      res.venue.should.eql('TESTEX')
      res.symbol.should.eql('FOOBAR')
      res.direction.should.eql('sell')
      res.originalQty.should.eql(3)
      res.price.should.eql(2375)
      res.orderType.should.eql('limit')
      res.account.should.eql('EXB123456')
      res.should.have.property('id')
      res.should.have.property('ts')
      res.should.have.property('fills')
      res.should.have.property('open')
    })
  })

  it('GET /venues/:venue/stocks/:stock/quote', () => {
    return api.quote({ venue: 'TESTEX', stock: 'FOOBAR' })
      .then(res => {
        res.ok.should.be.true
        res.venue.should.eql('TESTEX')
        res.symbol.should.eql('FOOBAR')
        res.should.have.property('bid')
        res.should.have.property('bidSize')
        res.should.have.property('askSize')
        res.should.have.property('last')
        res.should.have.property('lastTrade')
        res.should.have.property('quoteTime')
      })
  })

  it('GET /venues/:venue/stocks/:stock/orders/:id', () => {
    return api.buy({ venue: 'TESTEX', stock: 'FOOBAR', account: 'EXB123456', quantity: 1, type: 'market' })
      .then(res => {
        return api.order_status({ venue: 'TESTEX', stock: 'FOOBAR', id: res.id })
      }).then(res => {
        res.ok.should.be.true
        res.venue.should.eql('TESTEX')
        res.symbol.should.eql('FOOBAR')
        res.should.have.property('fills')
        res.should.have.property('open')
      })
  })

  it('DELETE /venues/:venue/stocks/:stock/orders/:id', () => {
    return api.buy({ venue: 'TESTEX', stock: 'FOOBAR', account: 'EXB123456', quantity: 1, type: 'market' })
      .then(res => {
        return api.cancel_order({ venue: 'TESTEX', stock: 'FOOBAR', id: res.id })
      }).then(res => {
        res.ok.should.be.true
        res.venue.should.eql('TESTEX')
        res.symbol.should.eql('FOOBAR')
        res.should.have.property('fills')
        res.open.should.be.false
      })
  })

  it('GET /venues/:venue/accounts/:account/orders', () => {
    return api.all_orders({ venue: 'TESTEX', account: 'BOGI123' })
      .then(res => { console.log(res) })
  })

  it('GET /venues/:venue/accounts/:account/stock/:stock/orders', () => {
    return api.all_orders({ venue: 'TESTEX', account: 'BOGI123', stock: 'FOOBAR' })
      .then(res => { console.log(res) })
  })
})
