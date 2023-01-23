"use client";
import "../styles/globals.css";
import Image from "next/image";
import React, { useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  const [optionsVisible, setOptionsVisible] = useState<boolean>(true);
  return (
    <nav className="navbar-con">
      <input type="search" name="search-box" id="search-box" />
      <BsBellFill className="bell-ico" />
      <div className="image-con">
        <Image
          src={"https://api.lorem.space/image/face?w=150&h=150"}
          fill
          alt="PFP"
          onClick={() => setOptionsVisible(!optionsVisible)}
        />
        <div
          className="options"
          style={optionsVisible ? { display: "none" } : { display: "block" }}
        >
          <span
            onClick={() => signOut()}
            style={{ display: session ? "inline" : "none" }}
          >
            LOGOUT{" "}
          </span>
        </div>
      </div>
    </nav>
  );
}
