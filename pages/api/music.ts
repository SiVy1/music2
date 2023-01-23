import type { NextApiRequest, NextApiResponse } from "next";
const password = process.env.PASSWORD;
let url = "mongodb://127.0.0.1:27017";
const mongodb = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

const MongoClient = mongodb.MongoClient;
type Data = {
  name: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let db = null;
  MongoClient.connect(url, {}, (error: any, client: any) => {
    if (error) console.log(error);
    const ids = req.body;
    console.log(ids);
    const arr = new Array();
    for (const i in req.query) {
      arr.push(new ObjectId(req.query[i]));
    }
    console.log(arr);
    const db = client.db("musicapp");
    db.collection("music")
      .find({ _id: { $in: arr } })
      .toArray((err: any, result: any) => {
        res.send(result);
        if (err) console.log(err);
      });
  });
}
