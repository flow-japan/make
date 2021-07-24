import { Button } from '@chakra-ui/react'
import { KmsAuthorizer } from 'fcl-kms-authorizer';
import AWS from 'aws-sdk';
import * as fcl from '@onflow/fcl';

const region = 'ap-northeast-1';
const keyId = '151ad4eb-a4e9-4cd5-b84f-fd96a8944c97';
const apiUrl = 'http://localhost:8080';
fcl.config().put('accessNode.api', apiUrl);

// const authorizer = new KmsAuthorizer({ region }, keyId);
const authorizer = new KmsAuthorizer({
  credentials: new AWS.Credentials(
    'AKIAXOGTWSDRT55NLIHM',
    'jfCWsue1jPjzGVecXBOk9upExTMD20cnzAWZkAze',
  ),
  region
}, keyId);

const mint = async () => {
  const address = '01cf0e2f2f715450';
  const keyIndex = 0;

  const authorization = authorizer.authorize(address, keyIndex);

  const response = await fcl.send([
    fcl.transaction`
      transaction {
        prepare(signer: AuthAccount) {
          log("Test transaction signed by fcl-kms-authorizer")
        }
      }
    `,
    fcl.args([]),
    fcl.proposer(authorization),
    fcl.authorizations([authorization]),
    fcl.payer(authorization),
    fcl.limit(9999),
  ]);
  await fcl.tx(response).onceSealed();

  console.log('OK1')
};

export const Item = (props) => (
  <Button onClick={mint}>Mint</Button>
)
