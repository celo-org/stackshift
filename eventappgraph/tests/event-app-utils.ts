import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { EventListed } from "../generated/EventApp/EventApp"

export function createEventListedEvent(
  id: BigInt,
  owner: Address,
  regFee: BigInt
): EventListed {
  let eventListedEvent = changetype<EventListed>(newMockEvent())

  eventListedEvent.parameters = new Array()

  eventListedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  eventListedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  eventListedEvent.parameters.push(
    new ethereum.EventParam("regFee", ethereum.Value.fromUnsignedBigInt(regFee))
  )

  return eventListedEvent
}
