import Collectible from "../contracts/Collectible.cdc"
import Showcase from "../contracts/Showcase.cdc"
// import Collectible from 0x6f48f852926e137a
// import Showcase from 0x6f48f852926e137a

transaction(tokenID: UInt64) {
    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath)!
        let collectionCapability = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()!
        if collection.borrowNFT(id: tokenID) == nil {
            panic("Cannot borrow NFT")
        }
        Showcase.list(collectionCapability: collectionCapability, tokenID: tokenID, ownerAddress: acct.address)

        log("List NFT succeeded")
    }
}
