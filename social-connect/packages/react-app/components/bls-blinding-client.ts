import { randomBytes } from 'crypto'
import thresholdBls from 'blind-threshold-bls'

export interface BlsBlindingClient {
  blindMessage: (base64PhoneNumber: string, seed?: Buffer) => Promise<string>
  unblindAndVerifyMessage: (blindedMessage: string) => Promise<string>
}

// The following interfaces should match https://github.com/celo-org/blind-threshold-bls-wasm/blob/master/src/blind_threshold_bls.d.ts

interface ThresholdBlsLib {
  blind: (message: Uint8Array, seed: Uint8Array) => BlindedMessage
  unblind: (blindedSignature: Uint8Array, blindingFactor: Uint8Array) => Uint8Array
  verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => void // throws on failure
}

interface BlindedMessage {
  blindingFactor: Uint8Array
  message: Uint8Array
}

export default class WebBlsBlindingClient implements BlsBlindingClient {
  private odisPubKey: Uint8Array
  private blindedValue: BlindedMessage | undefined
  private rawMessage: Buffer | undefined

  constructor(odisPubKey: string) {
    this.odisPubKey = Buffer.from(odisPubKey, 'base64')
  }

  async init() {
    await thresholdBls.init("/blind_threshold_bls_bg.wasm")
  }

  async blindMessage(base64PhoneNumber: string, seed?: Buffer): Promise<string> {
    const userSeed = seed ?? randomBytes(32)
    if (!seed) {
      console.warn(
        'Warning: Use a private deterministic seed (e.g. DEK private key) to preserve user quota when requests are replayed.'
      )
    }
    this.rawMessage = Buffer.from(base64PhoneNumber, 'base64')
    this.blindedValue = await thresholdBls.blind(this.rawMessage, userSeed)
    const blindedMessage = this.blindedValue.message
    return Buffer.from(blindedMessage).toString('base64')
  }

  async unblindAndVerifyMessage(base64BlindSig: string): Promise<string> {
    if (!this.rawMessage || !this.blindedValue) {
      throw new Error('Must call blind before unblinding')
    }

    const blindedSignature = Buffer.from(base64BlindSig, 'base64')
    const unblindMessage = await thresholdBls.unblind(
      blindedSignature,
      this.blindedValue.blindingFactor
    )
    // this throws on error
    await thresholdBls.verify(this.odisPubKey, this.rawMessage, unblindMessage)
    return Buffer.from(unblindMessage).toString('base64')
  }

  private isReactNativeEnvironment(): boolean {
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  }
}
