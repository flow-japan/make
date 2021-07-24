// https://nft.storage

// import { NFTStorage, File } from 'nft.storage';

class NftStorageService {
  async upload(imageData, fileName) {
    console.log(imageData)
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENGMkJCNjRlMzNjZDA3MEJCNTNiMzY4QkVFRmZDYjE2QjgzOTVkRWQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNzA5NDYwMzE2NSwibmFtZSI6Imluc2NyaWJlIn0.Dt3ipWB_fSmo_0Tjeb5w65aHYS_wMJ6q8mi39dYtYUY';

    // const client = new NFTStorage({ token: apiKey });
    
    // const metadata = await client.store({
    //   name: 'Pinpie',
    //   description: 'Pin is not delicious beef!',
    //   image: new File([imageData], fileName, { type: 'image/jpg' })
    // });
    // // console.log(metadata.url)
    // // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json

    // console.log('IPFS URL for the metadata:', metadata.url)
    // console.log('metadata.json contents:\n', metadata.data)
    // console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
  }
}

const nftStorage = new NftStorageService();

export { nftStorage };
