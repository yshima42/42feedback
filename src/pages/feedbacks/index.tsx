import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Box, Heading } from "@chakra-ui/react";
import { cursusProjects } from "../../../utils/objects";

const Feedbacks = () => {
  return (
    <Layout>
      <Heading>Feedbacks</Heading>
      {cursusProjects.map((cursusProject) => (
        <Box key={cursusProject.slug}>
          <Link href={`/feedbacks/${cursusProject.slug}/1`}>
            {cursusProject.name}
          </Link>
        </Box>
      ))}
    </Layout>
  );
};

export default Feedbacks;
