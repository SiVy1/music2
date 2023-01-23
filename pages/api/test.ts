import type { NextApiRequest, NextApiResponse } from "next";
const password = process.env.PASSWORD;
let url = "mongodb://127.0.0.1:27017";
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let dbname = "musicapp";
type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let db = null;

  MongoClient.connect(url, {}, (error: any, client: any) => {
    const db = client.db("musicapp");
    db.collection("playlist")
      .find({})
      .toArray((err: any, result: any) => {
        res.send(result);
        if (err) console.log(err);
      });
  });
}
