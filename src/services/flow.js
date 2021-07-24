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
          let metadata = token.getMetadata()
          metadata["id"] = token.id.toString()
          metadataArray.append(metadata)
      }
      return metadataArray
  }  
`;

const getCreatedCollectibleDataScript = `
  import Collectible from 0xCollectible

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
`;

const createCollectibleDataTransaction = `
  import Collectible from 0xCollectible

  transaction(metadata: {String: String}, limit: UInt64) {
      prepare(acct: AuthAccount) {
          // Setup Minter
          if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
              acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
              acct.link<&{Collectible.CollectibleMinterPublic}>(Collectible.MinterPublicPath, target: Collectible.MinterStoragePath)
          }

          // Create CollectibleData
          let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
          let maintainer = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
          let collectibleDataId = minter.createCollectibleData(metadata: metadata, limit: limit)

          log("Create CollectibleData succeeded: ".concat(collectibleDataId.toString()))
      }
  }
`;

const mintNFTTransaction = `
  import Collectible from 0xCollectible

  transaction(collectibleDataId: UInt64, mintNum: Int) {
      prepare(acct: AuthAccount) {
          // Setup Collection
          if acct.borrow<&Collectible.Collection>(from: Collectible.CollectionStoragePath) == nil {
              acct.save(<- Collectible.createEmptyCollection(), to: Collectible.CollectionStoragePath)
              acct.link<&{Collectible.CollectibleCollectionPublic}>(Collectible.CollectionPublicPath, target: Collectible.CollectionStoragePath)
          }

          // Setup Minter
          if acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath) == nil {
              acct.save(<- Collectible.createMinter(), to: Collectible.MinterStoragePath)
              acct.link<&{Collectible.CollectibleMinterPublic}>(Collectible.MinterPublicPath, target: Collectible.MinterStoragePath)
          }

          // Mint and Deposit NFTs
          let minter = acct.borrow<&Collectible.Minter>(from: Collectible.MinterStoragePath)!
          let receiverRef = acct.getCapability(Collectible.CollectionPublicPath).borrow<&{Collectible.CollectibleCollectionPublic}>()
              ?? panic("Cannot borrow a reference to the recipient's Replica collection")
          var i = 0
          while i < mintNum {
              let token <- minter.mintNFT(collectibleDataId: collectibleDataId)
              receiverRef.deposit(token: <- token)
              i = i + 1
          }
      }
  }
`;

class FlowService {
  constructor() {
    fcl.config()
      // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
      // .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
      .put('accessNode.api', 'https://access-testnet.onflow.org') // Flow testnet
      .put('challenge.handshake', 'https://flow-wallet-testnet.blocto.app/authn') // Blocto testnet wallet
      .put('0xCollectible', '0x85875109cfe22e4a') // Testnet
    }

  authenticate() {
    fcl.authenticate();
  }

  unauthenticate() {
    fcl.unauthenticate();
  }

  setCurrentUser(setUser) {
    fcl.currentUser().subscribe((currentUser) => setUser({ ...currentUser }))
  }

  async getCurrentUserAddressInner() {
    return new Promise((resolve, reject) => {
      try {
        fcl.currentUser().subscribe(async curretUser => {
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
    const response = await fcl.send([ fcl.script(script), fcl.args(args) ]);
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

  async getMetadata(addr, id) {
    const metadataArray = await this.executeScript(getMedatadaScript, [ fcl.arg(addr, t.Address), fcl.arg([Number(id)], t.Array(t.UInt64)) ]);
    if (!metadataArray || metadataArray.length === 0) return {};
    return metadataArray[0];
  }

  async getAllMetadata() {
    const addr = await this.getCurrentUserAddress();
    if (!addr) return [];
    return await this.executeScript(getAllMedatadaScript, [ fcl.arg(addr, t.Address) ]);
  }

  async getCreatedCollectibleData() {
    const addr = await this.getCurrentUserAddress();
    if (!addr) return [];
    const collectibleData = await this.executeScript(getCreatedCollectibleDataScript, [ fcl.arg(addr, t.Address) ]);
    return collectibleData || [];
  }

  async createCollectibleData(name, description, imageUrl, limit) {
    try {
      return await this.sendTransaction(createCollectibleDataTransaction, [
        fcl.arg(
          [
            { key: 'name', value: name },
            { key: 'description', value: description },
            { key: 'image', value: imageUrl },
          ],
          t.Dictionary({ key: t.String, value: t.String })
        ),
        fcl.arg(Number(limit), t.UInt64),
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  async mintNFT(collectibleDataId, mintNum) {
    return await this.sendTransaction(mintNFTTransaction, [
      fcl.arg(Number(collectibleDataId), t.UInt64),
      fcl.arg(Number(mintNum), t.Int),
    ]);
  }
}

const flow = new FlowService();

export { flow };
