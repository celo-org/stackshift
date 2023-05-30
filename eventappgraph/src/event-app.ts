import { EventListed as EventListedEvent } from "../generated/EventApp/EventApp"
import { EventListed } from "../generated/schema"

export function handleEventListed(event: EventListedEvent): void {
  let entity = new EventListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.EventApp_id = event.params.id
  entity.owner = event.params.owner
  entity.regFee = event.params.regFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
