import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";

const YshimazuPage = () => {
  return (
    <Layout>
      <Heading>yshimazu - dev practice</Heading>
      <LineChartSample />
    </Layout>
  );
};

export default YshimazuPage;
