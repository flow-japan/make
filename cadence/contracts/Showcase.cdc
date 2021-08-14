import Collectible from "./Collectible.cdc"

pub contract Showcase {
    pub event Deposit(id: UInt64, tokenId: UInt64, from: Address)
    pub event Withdraw(id: UInt64)
    pub event UpdatePause(isPaused: Bool)

    pub let AdminStoragePath: StoragePath

    pub var items: @{UInt64: Item}
    pub var itemIdCount: UInt64
    pub var isPaused: Bool

    pub resource Item {
        pub let ownerAddress: Address
        pub let token: @{String: Collectible.NFT}

        init(ownerAddress: Address, token: @Collectible.NFT) {
            self.ownerAddress = ownerAddress
            self.token <- {}
            self.token["token"] <-! token
        }

        pub fun borrowNFT(): &Collectible.NFT {
            return &self.token["token"] as &Collectible.NFT
        }

        destroy() {
            destroy self.token
        }
    }

    pub fun deposit(token: @Collectible.NFT, ownerAddress: Address) {
        if Showcase.isPaused {
            panic("Showcase is paused")
        }
        self.itemIdCount = self.itemIdCount + 1 as UInt64
        emit Deposit(id: self.itemIdCount, tokenId: token.id, from: ownerAddress)
        self.items[self.itemIdCount] <-! create Item(ownerAddress: ownerAddress, token: <- token)
    }

    pub fun withdraw(itemId: UInt64): @Collectible.NFT {
        // MEMO: 誰でも withdraw できることに注意
        if Showcase.isPaused {
            panic("Showcase is paused")
        }
        let item <- self.items.remove(key: itemId)!
        let token <- item.token.remove(key: "token")!
        destroy item
        emit Withdraw(id: self.itemIdCount)
        return <- token
    }

    pub fun getIDs(): [UInt64] {
        return self.items.keys
    }

    pub fun borrowItem(itemId: UInt64): &Showcase.Item {
        return &self.items[itemId] as &Showcase.Item
    }

    pub resource Admin {
        pub fun pause() {
            Showcase.isPaused = true
            emit UpdatePause(isPaused: true)
        }

        pub fun unpause() {
            Showcase.isPaused = false
            emit UpdatePause(isPaused: false)
        }
    }

    init() {
        self.AdminStoragePath = /storage/ShowcaseAdmin000
        self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
        self.items <- {}
        self.itemIdCount = 0
        self.isPaused = false
    }
}
