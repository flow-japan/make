import Collectible from "../contracts/Collectible.cdc"
import Showcase from "../contracts/Showcase.cdc"
// import Collectible from 0x6f48f852926e137a
// import Showcase from 0x6f48f852926e137a

transaction(tokenID: UInt64) {
    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath)!
        let token <- collection.withdraw(withdrawID: tokenID) as! @Collectible.NFT
        Showcase.deposit(token: <- token, ownerAddress: acct.address)

        log("Deposit NFT to Showcase succeeded")
    }
}
