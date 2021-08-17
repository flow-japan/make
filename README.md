<p align="center">
    <a href="https://make-nft.vercel.app/">
        <img width="400" src="./etc/banner.png" />
    </a>
</p>

👋 ようこそ！このウェブアプリは Flow ブロックチェーンで NFT を発行するための実験的なサービスです。

## 🎬 Live Demo

https://make-nft.vercel.app

Testnetで稼働しています

## 🔎 Project Overview

### 1. フロントエンド（静的ウェブサイト） [./](./)

Next.js / React.js で構築しており、デモサイトは Vercel 上で稼働しています。フロントエンドでは、FCL（Flow Client Library, `@onflow/fcl`）を使って、サードパーティの Blocto Wallet に接続し、Flow のアクセスノードを介して Flow 上のアカウントやコントラクトとやり取りします。

### 2. バックエンド [./src/pages/api](./src/pages/api/)

Next.js の API 機能で、通報などごくわずかな機能を担っています。ほぼすべてのトランザクションはユーザーが送信するため、バックエンドには主要なロジックは含まれていません。


### 3. スマートコントラクト [./cadence](./cadence/)

Cadence 言語で以下のスマートコントラクトを実装し、テストネットにデプロイしています。

- Collectible
    - NonFungibleToken インターフェースを実装した NFT コントラクト
    - ユーザーはこのコントラクトで NFT を mint する
- LikeToken
    - Like 機能を実現するための NFT コントラクト
    - Like は NFT として発行し、Collectible の NFT に持たせる
- Showcase
    - NFT のショーケース
    - ユーザーは、所有する NFT をこのコントラクトに預けることができる
    - このコントラクトをある種の中央台帳として扱うことで、バックエンドのワーカーおよびDBを用意しなくても、他の人のNFTを一覧でみられるようにしている
    - 外部からのストレージ圧迫の攻撃を受ける可能性があるため、コントラクトには管理者だけが一時停止できる機能を持たせている

## ❓ 問い合わせ・要望

- Discord: [Flow開発コミュニティ](https://discord.gg/UqDbSMy9qt) 
- Twitter: [@arandoros](https://twitter.com/arandoros)

---

## 🤝 スポンサー

このサービスは [doublejump.tokyo株式会社](https://www.doublejump.tokyo/) の協力のもと開発されています。

## 🇯🇵 Flow 開発コミュニティについて

Flowチーム公認の日本の開発コミュニティです。開発情報の発信や勉強会を実施しています。

ご興味ある方はぜひ Discord にご参加ください。

- Discord: https://discord.gg/UqDbSMy9qt
- YouTube: https://www.youtube.com/channel/UCzqVseWmvmLizVYO5iO-C1A
- Medium: https://medium.com/flow-japan
- Connpass: https://flow-japan-community.connpass.com/
- 管理人：https://twitter.com/arandoros   https://twitter.com/tokchin
