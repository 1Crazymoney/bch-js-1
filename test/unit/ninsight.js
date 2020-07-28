const chai = require("chai")
const assert = chai.assert
const axios = require("axios")
const sinon = require("sinon")

const BCHJS = require("../../src/bch-js")
const bchjs = new BCHJS()

const mockData = require("./fixtures/ninsight-mock")

describe(`#Ninsight`, () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe(`#utxo`, () => {
    it(`should throw an error for improper input`, async () => {
      try {
        const addr = 12345

        await bchjs.Ninsight.utxo(addr)
        assert.equal(true, false, "Unexpected result!")
      } catch (err) {
        //console.log(`err: `, err)
        assert.include(err.message, `address needs to be a string`)
      }
    })

    it(`should GET utxos for a single address`, async () => {
      // Stub the network call.
      sandbox.stub(axios, "get").resolves({ data: mockData.utxo })

      const addr = "bitcoincash:qqh793x9au6ehvh7r2zflzguanlme760wuzehgzjh9"

      const result = await bchjs.Ninsight.utxo(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.property(result, "utxos")
      assert.property(result, "legacyAddress")
      assert.property(result, "cashAddress")
      assert.property(result, "slpAddress")
      assert.property(result, "scriptPubKey")
      assert.property(result, "asm")

      assert.isArray(result.utxos)

      assert.property(result.utxos[0], "txid")
      assert.property(result.utxos[0], "vout")
      assert.property(result.utxos[0], "amount")
      assert.property(result.utxos[0], "satoshis")
      assert.property(result.utxos[0], "height")
      assert.property(result.utxos[0], "confirmations")
    })
  })
})
