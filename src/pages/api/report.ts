import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'webhook-discord';

type Response = {
  success: boolean;
};

const sendToSlack = async (text: string) => {
  const url = process.env.SLACK_WEBHOOK_URL || '';
  const webhook = new Webhook(url);
  await webhook.warn('Report from user', text);
  // MEMO: `setColor` doesn't work, probably because of the change in Discord's specifications.
  // const msg = new MessageBuilder().setName('alert').setText(text);
  // await webhook.send(msg);
};

const getPramAsString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param || '';
};

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method === 'POST') {
    try {
      console.log(req.body);
      const text = `ItemId: ${getPramAsString(
        req.body.itemId
      )}, Message: ${getPramAsString(req.body.message)}`;
      await sendToSlack(text);
      res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(400).json({ success: false });
  }
};
