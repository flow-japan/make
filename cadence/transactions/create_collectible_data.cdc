import Collectible from "../contracts/Collectible.cdc"
// import Collectible from 0x6f48f852926e137a

transaction(metadata: {String: String}, limit: UInt64) {
    prepare(acct: AuthAccount) {
        // Setup Minter
        if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
            acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
            acct.link<&{Collectible.CollectibleMinterPublic}>(Collectible.MinterPublicPath, target: Collectible.MinterStoragePath)
        }

        // Create CollectibleData
        let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
        let maintainer = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
        let collectibleDataId = minter.createCollectibleData(metadata: metadata, limit: limit)

        log("Create CollectibleData succeeded: ".concat(collectibleDataId.toString()))
    }
}
