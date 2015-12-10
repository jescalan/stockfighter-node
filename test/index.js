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
})
