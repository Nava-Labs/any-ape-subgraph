import { BigInt, BigDecimal, store, Address, Bytes } from '@graphprotocol/graph-ts'
import { EsperPresaleSync as EsperPresaleSyncEvent, Buy } from '../types/EsperPresale/EsperPresale'

export function handleListed(listed: ListedEvent): void {
  // if (listed.params.from == ADDRESS_ZERO) { //mint
  //   updateUserBalance(transfer.params.to, true, transfer.params.value)
  //   updateTotalSupply(transfer.address, true, transfer.params.value)
  // }
}

export function updateListed(type: String, from: Bytes, to: Bytes): void {
  let finalListedItems = ListedItems.load(from)
  let activity = "Sale";
  switch(type){
    case "0": //Sale Cross-Chain
      activity = "Sale Cross-Chain";
      break;
    case "1": //Sale Native
      activity = "Sale Native";
      break;
  }
  finalListedItems.save();
}

export function handleTransfer(transfer: TransferEvent): void {
  let transferNFT = Activity.load(transfer.address.toHex())
  if (fairAuctionFactory == null) {
    fairAuctionFactory = new FairAuctionFactory(event.address.toHex())
  }
  if (transfer.params.from == ADDRESS_ZERO) {
    updateActivity(transfer.params.to, true, transfer.params.value)
    updateTotalSupply(transfer.address, true, transfer.params.value)
  }

}

// To do create multicall helper

