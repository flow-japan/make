import fleekStorage from '@fleekhq/fleek-storage-js'

class FleekService {
  async upload(imageData, fileName) {
    console.log(process.env.NEXT_PUBLIC_FLEEK_API_KEY)
    const result = await fleekStorage.upload({
      apiKey: process.env.NEXT_PUBLIC_FLEEK_API_KEY,
      apiSecret: process.env.NEXT_PUBLIC_FLEEK_API_SECRET,
      bucket: process.env.NEXT_PUBLIC_FLEEK_BACKET_NAME || undefined,
      key: `${fileName}-${Date.now()}`,
      data: imageData,
    });
    return result.hash.replace(/\"/g, '');
  }

  getURL(hash) {
    return `https://ipfs.fleek.co/ipfs/${hash}`;
  }
}

const fleek = new FleekService();

export { fleek };
