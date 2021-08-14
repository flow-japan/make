import Collectible from "../contracts/Collectible.cdc"
import Showcase from "../contracts/Showcase.cdc"
// import Collectible from 0x6f48f852926e137a
// import Showcase from 0x6f48f852926e137a

pub fun main(): [{String: String}] {
    var metadataArray: [{String: String}] = []
    for itemId in Showcase.getIDs() {
        let itemRef = Showcase.borrowItem(itemId: itemId)
        let tokenRef = itemRef.borrowNFT()
        let metadata = tokenRef.metadata

        var likedAddresses = ""
        var flag = false
        for addr in tokenRef.likes.keys {
            if !flag {
                flag = true
            } else {
                likedAddresses = likedAddresses.concat(",")
            }
            likedAddresses = likedAddresses.concat(addr.toString())
        }

        metadataArray.append({
            "itemId": itemId.toString(),
            "tokenID": tokenRef.id.toString(),
            "ownerAddress": itemRef.ownerAddress.toString(),
            "name": metadata["name"]!,
            "description": metadata["description"]!,
            "image": metadata["image"]!,
            "likedAddresses": likedAddresses
        })
    }
    return metadataArray
}