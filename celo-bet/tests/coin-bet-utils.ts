import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BetPlaced,
  BetResult,
  OwnershipTransferred,
  TrustedSignerChanged
} from "../generated/CoinBet/CoinBet"

export function createBetPlacedEvent(
  user: Address,
  wager: BigInt,
  choice: BigInt,
  timestamp: BigInt
): BetPlaced {
  let betPlacedEvent = changetype<BetPlaced>(newMockEvent())

  betPlacedEvent.parameters = new Array()

  betPlacedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("wager", ethereum.Value.fromUnsignedBigInt(wager))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("choice", ethereum.Value.fromUnsignedBigInt(choice))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return betPlacedEvent
}

export function createBetResultEvent(
  user: Address,
  win: boolean,
  wager: BigInt,
  payout: BigInt,
  timestamp: BigInt
): BetResult {
  let betResultEvent = changetype<BetResult>(newMockEvent())

  betResultEvent.parameters = new Array()

  betResultEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  betResultEvent.parameters.push(
    new ethereum.EventParam("win", ethereum.Value.fromBoolean(win))
  )
  betResultEvent.parameters.push(
    new ethereum.EventParam("wager", ethereum.Value.fromUnsignedBigInt(wager))
  )
  betResultEvent.parameters.push(
    new ethereum.EventParam("payout", ethereum.Value.fromUnsignedBigInt(payout))
  )
  betResultEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return betResultEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTrustedSignerChangedEvent(
  newSigner: Address
): TrustedSignerChanged {
  let trustedSignerChangedEvent = changetype<TrustedSignerChanged>(
    newMockEvent()
  )

  trustedSignerChangedEvent.parameters = new Array()

  trustedSignerChangedEvent.parameters.push(
    new ethereum.EventParam("newSigner", ethereum.Value.fromAddress(newSigner))
  )

  return trustedSignerChangedEvent
}
