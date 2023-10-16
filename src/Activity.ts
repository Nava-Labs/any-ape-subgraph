import { BigInt, BigDecimal, store, Address, Bytes } from '@graphprotocol/graph-ts'
import {
  Listed as ListedEvent,
  Sale as SaleEvent
} from "../generated/NFTMarketplaceDummy/NFTMarketplaceDummy"
import { NFT, Activity } from "../generated/schema"
import { ERC721 } from "../generated/NFT/ERC721"
import { ADDRESS_ZERO, ZERO_BI } from './helpers'

export function handleListed(listedEvent: ListedEvent): void {
  let nftId = listedEvent.params.collectionAddr.toHex() + '-' + listedEvent.params.tokenId.toString();
  let nft = NFT.load(nftId);
  if (nft == null){
    nft = new NFT(nftId);
    nft.collectionAddress = listedEvent.params.collectionAddr;
    nft.owner = fetchNftOwner(listedEvent.address, listedEvent.params.tokenId);
    nft.collectionName = fetchCollectionName(listedEvent.params.collectionAddr);
    nft.uri = fetchUri(listedEvent.params.collectionAddr, listedEvent.params.tokenId)
  }
  nft.price = listedEvent.params.price;
  nft.save()
}

export function handleSale(saleEvent: SaleEvent): void{
  let saleId = saleEvent.address.toHex() + '-' + saleEvent.block.timestamp.toString();
  let tokenId = saleEvent.params.collectionAddr.toHex() + '-' + saleEvent.params.tokenId.toString();
  let activity = Activity.load(saleId);
  if (activity == null) {
    activity = new Activity(saleId);
    activity.type = saleEvent.params.saleType;
    activity.from = saleEvent.params.prevOwner;
    activity.to = saleEvent.params.newOwner;
    activity.timestamp = saleEvent.block.timestamp;
  }

  let nft = NFT.load(tokenId);
  if (nft==null){ //shouldnt be possible but just in case.
    nft = new NFT(tokenId);
    nft.collectionName = fetchCollectionName(saleEvent.params.collectionAddr);
    nft.uri = fetchUri(saleEvent.params.collectionAddr, saleEvent.params.tokenId);
  }
  nft.owner = fetchNftOwner(saleEvent.address, saleEvent.params.tokenId);
  nft.collectionAddress = saleEvent.params.collectionAddr;
  activity.price = nft.price; //preserve the price
  nft.price = ZERO_BI; //delist
  activity.nft = tokenId;
  nft.save();
  activity.save();
}

export function fetchCollectionName(collectionAddr: Address): string {
  let contract = ERC721.bind(collectionAddr);
  let data = "";
  let result = contract.try_name()
  if (result.reverted) {
  } else {
    data = result.value
  }
  return data
}

export function fetchNftOwner(collectionAddr: Address, tokenId: BigInt): Bytes {
  let contract = ERC721.bind(collectionAddr);
  let owner = collectionAddr;
  let result = contract.try_ownerOf(tokenId)
  if (result.reverted) {
  } else {
    owner = result.value
  }
  return owner
}

export function fetchUri(collectionAddr: Address, tokenId: BigInt): string {
  let contract = ERC721.bind(collectionAddr);
  let data = "";
  let result = contract.try_tokenURI(tokenId)
  if (result.reverted) {
  } else {
    data = result.value
  }
  return data
}