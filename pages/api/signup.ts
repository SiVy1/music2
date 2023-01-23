import type { NextApiRequest, NextApiResponse } from "next";
const CryptoJS = require("crypto-js");
const key = process.env.SECRET?.toString();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const password = process.env.PASSWORD;
let url = "mongodb://127.0.0.1:27017";
type Data = {
  mess: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const values = req.body.values;
  console.log(values);
  const ciphertext = CryptoJS.AES.encrypt(
    values.password.toString(),
    `${key}`
  ).toString();
  let db: any = null;
  MongoClient.connect(url, {}, (error: any, client: any) => {
    db = client.db("musicapp");
    db.collection("users")
      .find({ nickname: values.name })
      .toArray((err: any, result: any) => {
        if (result == null || result.length == 0) {
          db.collection("users")
            .find({ email: values.email.toLowerCase() })
            .toArray((err: any, result: any) => {
              if (result == null || result.length == 0) {
                res.status(200).send({
                  mess: "success",
                });
                db.collection("users").insert({
                  nickname: values.name,
                  password: ciphertext,
                  email: values.email.toLowerCase(),
                  fav: [],
                  playlist: [],
                });
              } else {
                res.status(404).json({
                  mess: "Użytkownik istnieje! Wybierz inny adres email",
                });
              }
            });
        } else {
          res.status(404).json({
            mess: "Użytkownik istnieje! Wybierz inna nazwę użytkownika",
          });
        }
      });
  });
}
