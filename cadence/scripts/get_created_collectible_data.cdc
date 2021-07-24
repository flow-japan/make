import Collectible from "../contracts/Collectible.cdc"
// import Collectible from 0x6f48f852926e137a

pub fun main(addr: Address): [{String: String}] {
    var collectibleDataArray: [{String: String}] = []
    let minterCapability = getAccount(addr).getCapability<&{Collectible.CollectibleMinterPublic}>(Collectible.MinterPublicPath)
    if !minterCapability.check() {
        return collectibleDataArray
    }
    let minter = minterCapability.borrow()!
    let ids = minter.getCreatedCollectibleDataIDs()
    for id in ids {
        let collectibleData = minter.getCreatedCollectibleData(collectibleDataId: id)!
        collectibleDataArray.append({
            "id": id.toString(),
            "name": collectibleData.metadata["name"]!,
            "description": collectibleData.metadata["description"]!,
            "image": collectibleData.metadata["image"]!,
            "limit": collectibleData.limit.toString(),
            "mintedCount": Collectible.mintedCountPerCollectibleData[id]!.toString()
        })
    }
    return collectibleDataArray
}
