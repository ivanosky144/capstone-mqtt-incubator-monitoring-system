import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({
    weight: ['500'],
    subsets: ['latin']
})

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Inkubi</title>
            </Head>
            <main className={inter.className}>
                <Component {...pageProps}/>
            </main>
        </>
    )
}