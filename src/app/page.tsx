import { graphql } from "@/fuse";
import { execute } from "@/fuse/server";

const UserQuery = graphql(`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      firstName
    }
  }
`);

export default async function Home() {
  const result = await execute({ query: UserQuery, variables: { id: "123" } });

  if (!result.data?.user) {
  }

  return (
    <>
      <p>fuse test</p>
      <div>User</div>
      <ul>
        <li>Name: {result.data?.user?.name}</li>
        <li>First Name: {result.data?.user?.firstName}</li>
      </ul>
    </>
  );
}
