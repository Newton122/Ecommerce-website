"use client";
import { useState } from "react";
export default function TestNav() {
  const [x, setX] = useState(0);
  return (
    <>
      <div onClick={() => setX(x + 1)}>count {x}</div>
    </>
  );
}
