import LikeToken from "../contracts/LikeToken.cdc"
import Showcase from "../contracts/Showcase.cdc"
// import LikeToken from 0x6f48f852926e137a
// import Showcase from 0x6f48f852926e137a

transaction(itemId: UInt64) {
    prepare(acct: AuthAccount) {
        // Setup Like Minter
        if acct.borrow<&LikeToken.Minter>(from: LikeToken.MinterStoragePath) == nil {
            acct.save(<- LikeToken.createMinter(), to: LikeToken.MinterStoragePath)
        }
        let likeMinter = acct.borrow<&LikeToken.Minter>(from: LikeToken.MinterStoragePath)!
        let tokenRef = Showcase.borrowItem(itemId: itemId).borrowNFT()
        tokenRef.like(likeToken: <- likeMinter.mintNFT())

        log("Like NFT succeeded")
    }
}
