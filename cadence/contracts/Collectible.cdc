import "NonFungibleToken"
// import NonFungibleToken from 0x631e88ae7f1d7c20 // Testnet
import "LikeToken"

pub contract Collectible: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Like(id: UInt64, from: Address)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub var totalSupply: UInt64

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let metadata: {String: String}
        pub var likes: @{Address: LikeToken.NFT}

        init(metadata: {String: String}) {
            Collectible.totalSupply = Collectible.totalSupply + 1 
            self.id = Collectible.totalSupply
            self.metadata = metadata
            self.likes <- {}
        }

        pub fun like(likeToken: @LikeToken.NFT) {
            emit Like(id: self.id, from: likeToken.minter)
            let oldLikeToken <- self.likes[likeToken.minter] <- likeToken
            destroy oldLikeToken
        }

        destroy() {
            destroy self.likes
        }
    }

    pub resource Minter {
        pub fun mintNFT(metadata: {String: String}): @NFT {
            return <- create NFT(metadata: metadata)
        }
    }

    pub resource interface CollectibleCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun like(id: UInt64, likeToken: @LikeToken.NFT)
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
            return <- token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            let batchCollection <- create Collection()
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            return <- batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Collectible.NFT
            if self.owner?.address != nil {
                emit Deposit(id: token.id, to: self.owner?.address)
            }
            self.ownedNFTs[token.id] <-! token
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            for key in tokens.getIDs() {
                self.deposit(token: <- tokens.withdraw(withdrawID: key))
            }
            destroy tokens
        }

        pub fun like(id: UInt64, likeToken: @LikeToken.NFT) {
            self.borrowCollectible(id: id).like(likeToken: <- likeToken)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowCollectible(id: UInt64): &Collectible.NFT {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
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
        return <- create Collectible.Collection()
    }

    init() {
        self.CollectionStoragePath = /storage/CollectibleCollection002
        self.CollectionPublicPath = /public/CollectibleCollection002
        self.MinterStoragePath = /storage/CollectibleMinter002

        self.totalSupply = 0
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&{CollectibleCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)
        emit ContractInitialized()
    }
}
