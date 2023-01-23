import Image from "next/image";
import React from "react";
import { BsMusicNote } from "react-icons/bs";
import girl from "../public/girl.png";
export default function Loader() {
  return (
    <div className="loader-con">
      <div className="left">
        <span className="title">
          Każdy dzień JEST LEPSZY kiedy słuchasz swojej ulubionej muzyki!
        </span>
        <span className="loading-span">Ładuje strone...</span>
        <span className="loader"></span>
      </div>
    </div>
  );
}
