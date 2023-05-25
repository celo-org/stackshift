import {
  BetPlaced as BetPlacedEvent,
  BetResult as BetResultEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TrustedSignerChanged as TrustedSignerChangedEvent
} from "../generated/CoinBet/CoinBet"
import {
  BetPlaced,
  BetResult,
  OwnershipTransferred,
  TrustedSignerChanged
} from "../generated/schema"

export function handleBetPlaced(event: BetPlacedEvent): void {
  let entity = new BetPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.wager = event.params.wager
  entity.choice = event.params.choice
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBetResult(event: BetResultEvent): void {
  let entity = new BetResult(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.win = event.params.win
  entity.wager = event.params.wager
  entity.payout = event.params.payout
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrustedSignerChanged(
  event: TrustedSignerChangedEvent
): void {
  let entity = new TrustedSignerChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newSigner = event.params.newSigner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
