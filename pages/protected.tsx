import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [content, setContent] = useState<any>()

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected")
      const json = await res.json()
      if (json.content) {
        setContent(json)
        // console.log({message:json.content});
      }else if(json.error){
        setContent(json)
      }
      
    }
    fetchData()
  }, [])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!content?.error) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>
        <strong>{content?.content}</strong>
      </p>
    </Layout>
  )
}
