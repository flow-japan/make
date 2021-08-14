import Showcase from "../contracts/Showcase.cdc"
// import Showcase from 0x6f48f852926e137a

transaction(isPaused: Bool) {
    prepare(acct: AuthAccount) {
        let adminRef = acct.borrow<&Showcase.Admin>(from: Showcase.AdminStoragePath)!
        if isPaused {
            adminRef.pause()
        } else {
            adminRef.unpause()
        }

        log("Update Showcase isPaused succeeded")
    }
}
