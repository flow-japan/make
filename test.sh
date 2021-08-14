# flow emulator

flow project deploy
# flow project deploy -n testnet
# flow accounts remove-contract Collectible -n testnet --signer testnetAccount1
# flow accounts remove-contract Showcase -n testnet --signer testnetAccount1
# flow accounts remove-contract LikeToken -n testnet --signer testnetAccount1

flow transactions send ./cadence/transactions/mint_nft.cdc \
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
    }
  ]'

flow scripts execute ./cadence/scripts/get_all_metadata.cdc --arg Address:f8d6e0586b0a20c7

flow transactions send ./cadence/transactions/deposit_nft.cdc --arg UInt64:1

flow scripts execute ./cadence/scripts/get_showcase_all_metadata.cdc

flow transactions send ./cadence/transactions/like_nft.cdc --arg UInt64:1

flow accounts create --key cd7c5c71cd5f2ee8e444ce5604d7cfeabefda02045e9bd0febce8a4d39930d5fbfade027b29759f5bac7643e22b864012afc38744dc30bc4a452677b9b84956a
flow transactions send ./cadence/transactions/like_nft.cdc --arg UInt64:1 --signer account1

flow scripts execute ./cadence/scripts/get_showcase_all_metadata.cdc


flow transactions send ./cadence/transactions/update_pause.cdc --arg Bool:true
flow transactions send ./cadence/transactions/update_pause.cdc --arg Bool:false
# # Fail
# flow transactions send ./cadence/transactions/update_pause.cdc --arg Bool:true --signer account1


###################
## テストネットのコントラクト
# https://flow-view-source.com/testnet/account/0x85875109cfe22e4a/contract/Collectible
#
## テストネットの tx 例
#
## CollectibleData の作成
# https://flow-view-source.com/testnet/tx/aa06f2f81e1b9dc0dc9824a847ff31b965338504b33ef3e5c86dc44b994d56e1

