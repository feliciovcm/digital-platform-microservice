import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0"

export default function AppHome() {
  const {user} = useUser();
  return (
    <div>
      <pre>
        {JSON.stringify(user,null, 2)}
      </pre>
      Hello world

      <a href="/api/auth/logout">logout</a>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired();

