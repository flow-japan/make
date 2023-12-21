import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

const getShowcaseAllMedatadaScript = `
  import Collectible from 0xCollectible
  import Showcase from 0xShowcase
  
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
              "tokenId": tokenRef.id.toString(),
              "ownerAddress": itemRef.ownerAddress.toString(),
              "name": metadata["name"]!,
              "description": metadata["description"]!,
              "image": metadata["image"]!,
              "likedAddresses": likedAddresses
          })
      }
      return metadataArray
  }
`;

const getAllMedatadaScript = `\
  import Collectible from 0xCollectible

  pub fun main(addr: Address): [{String: String}] {
      let metadataArray: [{String: String}] = []
      let collectionCapability = getAccount(addr).getCapability<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath)
      if !collectionCapability.check() {
          return metadataArray
      }
      let collection = collectionCapability.borrow()!
      let ids = collection.getIDs()
      for id in ids {
          let token = collection.borrowCollectible(id: id)
          let metadata = token.metadata
          metadata["id"] = token.id.toString()
          metadataArray.append(metadata)
      }
      return metadataArray
  } 
`;

const mintNFTTransaction = `
  import Collectible from 0xCollectible

  transaction(metadata: {String: String}) {
      prepare(acct: AuthAccount) {
          // Setup Collection
          if acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath) == nil {
              acct.save(<- Collectible.createEmptyCollection(), to: Collectible.CollectionStoragePath)
              acct.link<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath, target: Collectible.CollectionStoragePath)
          }

          // Setup Minter
          if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
              acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
          }

          // Mint and Deposit NFT
          let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
          let receiverRef = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()
              ?? panic("Cannot borrow a reference to the recipient's Replica collection")
          let token <- minter.mintNFT(metadata: metadata)
          receiverRef.deposit(token: <- token)

          log("Mint NFT succeeded")
      }
  }
`;

const deleteNFTTransaction = `
  import Collectible from 0xCollectible

  transaction(tokenID: UInt64) {
      prepare(acct: AuthAccount) {
          let collection = acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath)!
          let token <- collection.withdraw(withdrawID: tokenID) as! @Collectible.NFT
          destroy token

          log("Delete NFT")
      }
  }
`;

const depositNFTTransaction = `
  import Collectible from 0xCollectible
  import Showcase from 0xShowcase

  transaction(tokenID: UInt64) {
      prepare(acct: AuthAccount) {
          let collection = acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath)!
          let token <- collection.withdraw(withdrawID: tokenID) as! @Collectible.NFT
          Showcase.deposit(token: <- token, ownerAddress: acct.address)

          log("Deposit NFT to Showcase succeeded")
      }
  }
`;

const withdrawNFTTransaction = `
  import Collectible from 0xCollectible
  import Showcase from 0xShowcase

  transaction(itemId: UInt64) {
      prepare(acct: AuthAccount) {
          let collection = acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath)!
          let token <- Showcase.withdraw(itemId: itemId)
          collection.deposit(token: <- token)

          log("Withdraw NFT from Showcase succeeded")
      }
  }
`;

const likeNFTTransaction = `
  import LikeToken from 0xLikeToken
  import Showcase from 0xShowcase

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
`;

class FlowService {
  constructor() {
    fcl
      .config()
      // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
      // .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
      .put('accessNode.api', 'https://rest-testnet.onflow.org') // Flow testnet
      .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
      .put('app.detail.title', 'Make!')
      .put('app.detail.icon', 'https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cd5704b1c939_favicon.png')
      .put('0xCollectible', '0x85875109cfe22e4a') // Testnet
      .put('0xShowcase', '0x85875109cfe22e4a') // Testnet
      .put('0xLikeToken', '0x85875109cfe22e4a'); // Testnet
  }

  authenticate() {
    fcl.authenticate();
  }

  unauthenticate() {
    fcl.unauthenticate();
  }

  setCurrentUser(setUser) {
    fcl.currentUser().subscribe((currentUser) => setUser({ ...currentUser }));
  }

  async getCurrentUserAddressInner() {
    return new Promise((resolve) => {
      try {
        fcl.currentUser().subscribe(async (curretUser) => {
          return resolve(curretUser.addr);
        });
      } catch (e) {
        // TODO: Blocto のエラーを解決: Error: INVARIANT Attempt at triggering multiple Frames
        // reject(e);
        return resolve(null);
      }
    });
  }

  async getCurrentUserAddress() {
    try {
      let addr = await this.getCurrentUserAddressInner();
      if (!addr) {
        await this.authenticate();
        addr = await this.getCurrentUserAddressInner();
      }
      return addr;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async executeScript(script, args = []) {
    const response = await fcl.send([fcl.script(script), fcl.args(args)]);
    return await fcl.decode(response);
  }

  async sendTransaction(transaction, args) {
    const response = await fcl.send([
      fcl.transaction(transaction),
      fcl.args(args),
      fcl.proposer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.payer(fcl.currentUser().authorization),
      fcl.limit(9999),
    ]);
    console.log(response);
    return response;
  }

  async awaitSealed(response) {
    return await fcl.tx(response).onceSealed();
  }

  async getShowcaseAllMetadata() {
    const result = await this.executeScript(getShowcaseAllMedatadaScript, []);
    return result ? result.reverse() : result;
  }

  async getAllMetadata() {
    const addr = await this.getCurrentUserAddress();
    if (!addr) return [];
    return await this.executeScript(getAllMedatadaScript, [
      fcl.arg(addr, t.Address),
    ]);
  }

  async mintNFT(name, description, imageUrl) {
    return await this.sendTransaction(mintNFTTransaction, [
      fcl.arg(
        [
          { key: 'name', value: name },
          { key: 'description', value: description },
          { key: 'image', value: imageUrl },
        ],
        t.Dictionary({ key: t.String, value: t.String })
      ),
    ]);
  }

  async deleteNFT(tokenId) {
    return await this.sendTransaction(deleteNFTTransaction, [
      fcl.arg(Number(tokenId), t.UInt64),
    ]);
  }

  async depositNFT(tokenId) {
    return await this.sendTransaction(depositNFTTransaction, [
      fcl.arg(Number(tokenId), t.UInt64),
    ]);
  }

  async withdrawNFT(itemId) {
    return await this.sendTransaction(withdrawNFTTransaction, [
      fcl.arg(Number(itemId), t.UInt64),
    ]);
  }

  async likeNFT(itemId) {
    return await this.sendTransaction(likeNFTTransaction, [
      fcl.arg(Number(itemId), t.UInt64),
    ]);
  }
}

const flow = new FlowService();

export { flow };
