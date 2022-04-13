import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsContext, NextPage } from "next";

export type ApolloClientContext = GetServerSidePropsContext;

export const withApollo = (Component: NextPage) => {
  // Docs of integrating apollo with next ssr
  // ssrCache is used to share the same query's cache between the server side and the client side
  

  return function Provider(props: any) {
    return (
      <ApolloProvider client={getApolloClient(undefined, props.apolloState)}>
        <Component {...props} />
      </ApolloProvider>
    )
  }
}

export function getApolloClient (
  ctx?: ApolloClientContext,
  ssrCache?: NormalizedCacheObject) {
  const httpLink = createHttpLink({
    uri: 'http://localhost:3000/api',
    fetch,
  })
  
  const cache = new InMemoryCache().restore(ssrCache ?? {});
  
  return new ApolloClient({
    link: from([httpLink]),
    cache,
  })
}

