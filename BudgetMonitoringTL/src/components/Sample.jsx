// test react-to-print

import React from "react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function Sample() {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <button onClick={() => reactToPrintFn()}>Print</button>
      <div ref={contentRef}>
        Content to print It is also possible to lazy set the ref if your content
        being printed is dynamic. See the LazyContent example for more. This can
        also be useful for setting the ref in non-React code, such as util
        functions.
      </div>
    </div>
  );
}
