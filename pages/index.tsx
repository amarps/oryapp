import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { Configuration, FrontendApi, Session, Identity } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"
import Layout from "../layouts/Layout"

const ory = new FrontendApi(new Configuration(edgeConfig))

// Returns either the email or the username depending on the user's Identity Schema
const getUserName = (identity: Identity) =>
  identity.traits.email || identity.traits.username

const Home = () => {
  const router = useRouter()

  const [session, setSession] = useState<Session | undefined>()
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {

        console.log(data)

        // User has a session!
        setSession(data)
        // Create a logout url
        ory.createBrowserLogoutFlow().then(({ data }) => {
          setLogoutUrl(data.logout_url)
        })
      })
      .catch(() => {
        // Redirect to login page
        return router.push(edgeConfig.basePath + "/ui/login")
      })
  }, [router])

  if (!session) {
    // Still loading
    return null
  }

  return (
    <Layout auth={true} logout_url={logoutUrl}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>
        hi {getUserName(session?.identity)}
        </h3>
        <br />

    </Layout>
  )
}

export default Home