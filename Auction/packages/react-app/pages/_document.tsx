import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
