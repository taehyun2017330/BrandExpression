import MainPage from "@/component/pageComponent/main";
import Head from "next/head";
import { withBasePath } from "@/utils/paths";
export default function Main() {
  return (
    <>
      <Head>
        <title>Brand Expression Support System</title>
        <meta
          name="description"
          content="Research prototype for supporting brand owners in externalizing tacit knowledge for AI-assisted social media creation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={withBasePath("/favicon.ico")} />
      </Head>
      <main>
        <MainPage />
      </main>
    </>
  );
}
