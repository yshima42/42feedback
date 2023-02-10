import React from "react";
import { Flex } from "@chakra-ui/react";
import { FOOTER_HEIGHT, MAIN_COLOR } from "utils/constants";

const Footer: React.FC = () => {
  return (
    <Flex
      as="nav"
      bg={MAIN_COLOR}
      color="gray.50"
      h={FOOTER_HEIGHT}
      padding={{ base: "0.5rem", md: "0.7rem" }}
      mt={{ base: "1rem", md: "2rem" }}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
    ></Flex>
  );
};

export default Footer;
