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
    return api.heartbeat().should.eventually.deep.equal({ ok: true, error: '' })
  })

})