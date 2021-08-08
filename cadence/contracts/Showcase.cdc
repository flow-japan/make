// import NonFungibleToken from "./NonFungibleToken.cdc"
// import Collectible from "./Collectible.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20 // Testnet
import Collectible from 0x85875109cfe22e4a // Testnet

pub contract Showcase {
    pub var items: @{UInt64: Item}

    pub resource Item {
        pub let ownerAddress: Address
        pub let tokenID: UInt64

        init(ownerAddress: Address, tokenID: UInt64) {
            self.ownerAddress = ownerAddress
            self.tokenID = tokenID
        }
    }

    pub fun list(collectionCapability: &AnyResource{Collectible.CollectibleCollectionPublic}, tokenID: UInt64, ownerAddress: Address) {
        pre {
            collectionCapability.borrowNFT(id: tokenID) != nil: "NFT does not exist in the collection!"
            collectionCapability.borrowNFT(id: tokenID).owner?.address == ownerAddress: "ownerAddress is wrong!"
        }
        let oldData <- self.items[tokenID] <- create Item(ownerAddress: ownerAddress, tokenID: tokenID)
        destroy oldData
    }

    pub fun delist(tokenID: UInt64) {
        // TODO: リストした人以外はデリストできないようにする
        let oldData <-! self.items.remove(key: tokenID)
        destroy oldData
    }

    pub fun getAllMetadata(): {UInt64: {String: String}} {
        // TODO: NFT最大何個までいけるか要確認
        var metadataArray: {UInt64: {String: String}} = {}
        for tokenID in self.items.keys {
            let item <-! self.items.remove(key: tokenID)!
            let collection = getAccount(item.ownerAddress).getCapability<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath).borrow()!
            let token = collection.borrowCollectible(id: tokenID)
            let metadata = token.metadata
            metadataArray[tokenID] = {
                "tokenID": item.tokenID.toString(),
                "ownerAddress": item.ownerAddress.toString(),
                "name": metadata["name"]!,
                "description": metadata["description"]!,
                "image": metadata["image"]!
            }
            self.items[tokenID] <-! item
        }
        return metadataArray
    }

    init() {
        self.items <- {}
    }
}
