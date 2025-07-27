import { api } from "@/trpc/server";

export default async function Home() {
  const result = await api.post.hello({ text: "users" });
  return (
    <>
      <p>{result.greeting}</p>
    </>
  );
}
