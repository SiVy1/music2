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
    const { id } = req.query;
    console.log(id);
    if (error) console.log(error);
    const db = client.db("musicapp");
    db.collection("playlist")
      .find({ _id: new ObjectId(id) })
      .toArray((err: any, result: any) => {
        console.log(result);
        res.send(result);
        if (err) console.log(err);
      });
  });
}
