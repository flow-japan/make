<p align="center">
    <a href="https://make-nft.vercel.app/">
        <img width="400" src="./etc/banner.png" />
    </a>
</p>

👋 ようこそ！このデモアプリは、Flow ブロックチェーンで NFT を発行するための実験的サイトです。

## 🎬 Live Demo

https://make-nft.vercel.app

Testnetで稼働しています

## 🔎 Project Overview

### 1. フロントエンド（静的ウェブサイト） [./](./)

Next.js / React.js で構築しており、デモサイトは Vercel 上で稼働しています。フロントエンドでは、FCL（Flow Client Library, `@onflow/fcl`）を使って、サードパーティ製の Blocto Wallet に接続し、Flow のアクセスノードを介して Flow 上のアカウントやコントラクトとやり取りします。

### 2. バックエンド [./src/pages/api](./src/pages/api/)

Next.js の API 機能で、通報機能などごくわずかなを担っています。ほぼすべてのトランザクションはユーザーが送信するため、バックエンドには主要なロジックは含まれていません。


### 3. スマートコントラクト [./cadence](./cadence/)

Cadence 言語で以下のスマートコントラクトを実装し、テストネットにデプロイしています。

- Collectible
    - NonFungibleToken インターフェースを実装した NFT コントラクト
    - ユーザーはこのコントラクトで NFT を mint する
- LikeToken
    - Like 機能を実現するための NFT コントラクト
    - Like をひとつの NFT として発行し、Collectible の NFT に持たせる
- Showcase
    - NFT のショーケース
    - ユーザーは、所有する NFT を預けられる NFT をここに預け入れる
    - このコントラクトをある種の中央台帳として扱うことで、バックエンドのワーカーおよびDBを用意しなくても、他の人のNFTを一覧でみられるようにしている
    - ただしそれ故、外部からのストレージ圧迫の攻撃を受ける可能性があるため、コントラクトには管理者だけが一時停止できる機能を持たせている

## ❓ 問い合わせ先

- Twitter: [@arandoros](https://twitter.com/arandoros)
