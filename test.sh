# flow emulator

flow project deploy
# flow project deploy -n testnet

flow transactions send ./cadence/transactions/create_collectible_data.cdc \
  --args-json '[
    {
      "type": "Dictionary",
      "value": [
        {
          "key": { "type": "String", "value": "name" },
          "value": { "type": "String", "value": "テスト" }
        },
        {
          "key": { "type": "String", "value": "description" },
          "value": { "type": "String", "value": "説明" }
        },
        {
          "key": { "type": "String", "value": "image" },
          "value": { "type": "String", "value": "https://ipfs.fleek.co/ipfs/bafybeid26vj2bvsatvcifk5p2mxsamhhc6lhw3jnw6cphmu34s5pxj2qhy" }
        }
      ]
    },
    {"type": "UInt64", "value": "100"}
  ]'

flow scripts execute ./cadence/scripts/get_created_collectible_data.cdc --arg Address:f8d6e0586b0a20c7

# Gas 制限のため、9999 に設定しても、一度に mint できるのは 300 程度まで
flow transactions send ./cadence/transactions/mint_nfts.cdc \
  --arg UInt64:1 --arg Int:100 \
  --gas-limit 9999

flow scripts execute ./cadence/scripts/get_all_metadata.cdc --arg Address:f8d6e0586b0a20c7


###################

# テストネットのコントラクト
https://flow-view-source.com/testnet/account/0x85875109cfe22e4a/contract/Collectible

# テストネットの tx 例

## CollectibleData の作成
https://flow-view-source.com/testnet/tx/aa06f2f81e1b9dc0dc9824a847ff31b965338504b33ef3e5c86dc44b994d56e1

## NFT の mint

