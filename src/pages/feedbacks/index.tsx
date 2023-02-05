import Link from "next/link";
import { Heading } from "@chakra-ui/react";
import React from "react";
import Layout from "@/components/Layout";
import { cursusProjects } from "../../../utils/objects";

function Feedbacks() {
  return (
    <Layout>
      <Heading>Feedbacks</Heading>
      {cursusProjects.map((cursusProject) => (
        <>
          <Link
            key={cursusProject.slug}
            href={`/feedbacks/${cursusProject.slug}`}
          >
            {cursusProject.name}
          </Link>
          <br />
        </>
      ))}
    </Layout>
  );
}

export default Feedbacks;
