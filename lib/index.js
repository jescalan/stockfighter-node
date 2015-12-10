import rest from 'rest'
import pathPrefix from 'rest/interceptor/pathPrefix'
import defaultRequest from 'rest/interceptor/defaultRequest'
import mime from 'rest/interceptor/mime'

export default class StockFighterAPI {
  constructor (options) {
    this.apiKey = options.apiKey

    this.client = rest
      .wrap(pathPrefix, { prefix: 'https://api.stockfighter.io/ob/api/' })
      .wrap(defaultRequest, { headers: { 'X-Starfighter-Authorization': this.apiKey } })
      .wrap(mime, { mime: 'application/json' })
  }

  heartbeat () {
    return this.client({ path: 'heartbeat' }).then((res) => { return res.entity })
  }
}
