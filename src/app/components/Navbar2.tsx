"use client";
import { useState } from "react";
export default function Navbar2() {
  const [x, setX] = useState(0);
  return (
    <>
      <div onClick={() => setX(x + 1)}>count {x}</div>
    </>
  );
}
