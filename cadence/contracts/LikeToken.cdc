import "NonFungibleToken"
// import NonFungibleToken from 0x631e88ae7f1d7c20 // Testnet

pub contract LikeToken: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub var totalSupply: UInt64

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let minter: Address

        init(minter: Address) {
            LikeToken.totalSupply = LikeToken.totalSupply + 1
            self.id = LikeToken.totalSupply
            self.minter = minter
        }
    }

    pub resource Minter {
        pub fun mintNFT(): @NFT {
            return <- create NFT(minter: self.owner!.address)
        }
    }

    pub resource interface LikeCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowLike(id: UInt64): &LikeToken.NFT
    }

    pub resource Collection: LikeCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Cannot withdraw: LikeToken does not exist in the collection.")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            let batchCollection <- create Collection()
            for id in ids {
                batchCollection.deposit(token: <- self.withdraw(withdrawID: id))
            }
            return <- batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @LikeToken.NFT
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

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowLike(id: UInt64): &LikeToken.NFT {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return ref as! &LikeToken.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createMinter(): @Minter {
        return <- create Minter()
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create LikeToken.Collection()
    }

    init() {
        self.CollectionStoragePath = /storage/LikeCollection000
        self.CollectionPublicPath = /public/LikeCollection000
        self.MinterStoragePath = /storage/LikeMinter000

        self.totalSupply = 0
        self.account.save<@Collection>(<- create Collection(), to: self.CollectionStoragePath)
        self.account.link<&{LikeCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)
        emit ContractInitialized()
    }
}
