import GlobalStyle from "../src/style/Globalstyle";

export default function myApp({ Component, pageProps }) {
  console.log('roda em todas as paginas')

  return (
    <>  
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}