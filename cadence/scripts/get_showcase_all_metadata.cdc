import Collectible from "../contracts/Collectible.cdc"
import Showcase from "../contracts/Showcase.cdc"
// import Collectible from 0x6f48f852926e137a
// import Showcase from 0x6f48f852926e137a

pub fun main(): {UInt64: {String: String}} {
    return Showcase.getAllMetadata()
}
 