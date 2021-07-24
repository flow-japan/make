import Collectible from "../contracts/Collectible.cdc"
// import Collectible from 0x6f48f852926e137a

transaction(collectibleDataId: UInt64, mintNum: Int) {
    prepare(acct: AuthAccount) {
        // Setup Collection
        if acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath) == nil {
            acct.save(<- Collectible.createEmptyCollection(), to: Collectible.CollectionStoragePath)
            acct.link<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath, target: Collectible.CollectionStoragePath)
        }

        // Setup Minter
        if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
            acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
            acct.link<&{Collectible.CollectibleMinterPublic}>(Collectible.MinterPublicPath, target: Collectible.MinterStoragePath)
        }

        // Mint and Deposit NFTs
        let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
        let receiverRef = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's Replica collection")
        var i = 0
        while i < mintNum {
            let token <- minter.mintNFT(collectibleDataId: collectibleDataId)
            receiverRef.deposit(token: <- token)
            i = i + 1
        }

        log("Mint NFTs succeeded")
    }
}
