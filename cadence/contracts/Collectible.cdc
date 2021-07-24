// import NonFungibleToken from "./NonFungibleToken.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20 // Testnet

pub contract Collectible: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath
    pub let MinterPublicPath: PublicPath

    pub var totalSupply: UInt64
    pub var collectibleData: {UInt64: CollectibleData}
    pub var collectibleDataCount: UInt64
    pub var mintedCountPerCollectibleData: {UInt64: UInt64}

    pub struct CollectibleData {
        pub(set) var metadata: {String: String}
        pub let limit: UInt64

        init(metadata: {String: String}, limit: UInt64) {
            self.metadata = metadata
            self.limit = limit
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let collectibleDataId: UInt64

        pub fun getMetadata(): {String: String} {
            return Collectible.collectibleData[self.collectibleDataId]!.metadata
        }

        init(collectibleDataId: UInt64) {
            pre {
                Collectible.collectibleData[collectibleDataId] != nil: "Not Found CollectibleData"
                Collectible.collectibleData[collectibleDataId]!.limit >= Collectible.mintedCountPerCollectibleData[collectibleDataId]! + 1 as UInt64: "Cannot mint any more"
            }
            Collectible.mintedCountPerCollectibleData[collectibleDataId] = Collectible.mintedCountPerCollectibleData[collectibleDataId]! + 1 as UInt64
            Collectible.totalSupply = Collectible.totalSupply + 1 as UInt64
            self.id = Collectible.totalSupply
            self.collectibleDataId = collectibleDataId
        }
    }

    pub resource interface CollectibleMinterPublic {
        pub fun getCreatedCollectibleDataIDs(): [UInt64]
        pub fun getCreatedCollectibleData(collectibleDataId: UInt64): CollectibleData?
    }

    pub resource Minter: CollectibleMinterPublic {
        access(self) var collectibleData: {UInt64: CollectibleData}

        pub fun createCollectibleData(metadata: {String: String}, limit: UInt64): UInt64 {
            Collectible.collectibleDataCount = Collectible.collectibleDataCount + 1 as UInt64
            Collectible.mintedCountPerCollectibleData[Collectible.collectibleDataCount] = 0
            self.collectibleData[Collectible.collectibleDataCount] = CollectibleData(
                metadata: metadata,
                limit: limit
            )
            return Collectible.collectibleDataCount
        }

        pub fun mintNFT(collectibleDataId: UInt64): @NFT {
            pre {
                self.collectibleData.containsKey(collectibleDataId): "Not have permission to mint the NFT of the target collectibleDataId"
            }
            Collectible.collectibleData[collectibleDataId] = self.collectibleData[collectibleDataId]
            let nft <- create NFT(collectibleDataId: collectibleDataId)
            return <- nft
        }

        pub fun getCreatedCollectibleDataIDs(): [UInt64] {
            return self.collectibleData.keys
        }

        pub fun getCreatedCollectibleData(collectibleDataId: UInt64): CollectibleData? {
            return self.collectibleData[collectibleDataId]
        }

        init() {
            self.collectibleData = {}
        }
    }

    pub resource interface CollectibleCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCollectible(id: UInt64): &Collectible.NFT
    }

    pub resource Collection: CollectibleCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Cannot withdraw: Collectible does not exist in the collection.")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            let batchCollection <- create Collection()
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            return <-batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Collectible.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }
            destroy oldToken
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            let keys = tokens.getIDs()
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }
            destroy tokens
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowCollectible(id: UInt64): &Collectible.NFT {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
            return ref as! &Collectible.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createMinter(): @Minter {
        return <- create Minter()
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create Collectible.Collection()
    }

    init() {
        self.CollectionStoragePath = /storage/CollectibleCollection000
        self.CollectionPublicPath = /public/CollectibleCollection000
        self.MinterStoragePath = /storage/CollectibleMinter000
        self.MinterPublicPath = /public/CollectibleMinter000

        self.totalSupply = 0
        self.collectibleData = {}
        self.collectibleDataCount = 0
        self.mintedCountPerCollectibleData = {}
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&{CollectibleCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)
        emit ContractInitialized()
    }
}
