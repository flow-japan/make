import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

const getIDsScript = `
  import Collectible from 0xCollectible

  pub fun main(addr: Address): [UInt64] {
      let collectionCapability = getAccount(addr).getCapability<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath)
      if !collectionCapability.check() {
          return []
      }
      let collection = collectionCapability.borrow()!
      return collection.getIDs()
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

          // Mint and Deposit NFTs
          let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
          let receiverRef = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()
              ?? panic("Cannot borrow a reference to the recipient's Replica collection")
          let token <- minter.mintNFT(metadata: metadata)
          receiverRef.deposit(token: <- token)

          log("Mint NFTs succeeded")
      }
  }
`;

class FlowService {
  constructor() {
    fcl
      .config()
      // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
      // .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
      .put('accessNode.api', 'https://access-testnet.onflow.org') // Flow testnet
      .put(
        'challenge.handshake',
        'https://flow-wallet-testnet.blocto.app/authn'
      ) // Blocto testnet wallet
      .put('0xCollectible', '0x85875109cfe22e4a'); // Testnet
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
    return await fcl.tx(response).onceSealed();
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
}

const flow = new FlowService();

export { flow };
