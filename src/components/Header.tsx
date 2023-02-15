import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { SITE_NAME, MAIN_COLOR } from "utils/constants";
import { Logo } from "./Logo";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  let left = <Link href="/">{SITE_NAME}</Link>;

  let right = null;

  if (status === "loading") {
    left = <Link href="/">{SITE_NAME}</Link>;
    right = <Text>Validating session ...</Text>;
  }

  if (!session) {
    right = <Link href="/api/auth/signin">Log in</Link>;
  }

  if (session) {
    left = (
      <Heading as="h1" fontSize={{ base: "md", md: "xl" }}>
        <Link href="/">
          <Logo />
        </Link>
      </Heading>
    );
    right = (
      <Flex align="center">
        <Menu isLazy>
          <MenuButton>
            <Avatar src={session.user?.image ?? ""} size="sm" />
          </MenuButton>
          <MenuList color="gray.600" w={1}>
            <MenuItem icon={<ArrowForwardIcon />} onClick={() => signOut()}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      as="nav"
      bg={MAIN_COLOR}
      color="gray.50"
      align="center"
      justify="space-between"
      paddingY={{ base: "0.5rem", md: "0.7rem" }}
      paddingX={{ base: "0.8rem", md: "1.5rem" }}
    >
      {left}
      {right}
    </Flex>
  );
};

export default Header;
