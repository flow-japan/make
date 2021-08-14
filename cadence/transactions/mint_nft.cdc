import Collectible from "../contracts/Collectible.cdc"
// import Collectible from 0x6f48f852926e137a

transaction(metadata: {String: String}) {
    prepare(acct: AuthAccount) {
        // Setup Collection
        if acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath) == nil {
            acct.save(<- Collectible.createEmptyCollection(), to: Collectible.CollectionStoragePath)
            acct.link<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath, target: Collectible.CollectionStoragePath)
        }

        // Setup Minter
        if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
            acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
        }

        // Mint and Deposit NFT
        let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
        let receiverRef = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's Replica collection")
        let token <- minter.mintNFT(metadata: metadata)
        receiverRef.deposit(token: <- token)

        log("Mint NFT succeeded")
    }
}
