import { graphql } from "@/fuse";
import { execute } from "@/fuse/server";

export default async function Home() {
  const result = await execute({ query: VersionQuery });

  if (result.errors) {
    throw new Error("Something went wrong");
  }

  return (
    <>
      <p>fuse version: {result.data?._version}</p>
    </>
  );
}

const VersionQuery = graphql(`
  query Version {
    _version
  }
`);
