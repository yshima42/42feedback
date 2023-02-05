import Link from "next/link";
import { Heading } from "@chakra-ui/react";
import React from "react";
import Layout from "@/components/Layout";

// export default function Home() {
function Home() {
  return (
    <Layout>
      <Heading>42 Progress</Heading>
      <Link href="/same-grade">same grade progress(名前ダサいから変える)</Link>
      <br />
      <Link href="/feedbacks">feedbacks</Link>
    </Layout>
  );
}

export default Home;
