import React from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { FOOTER_HEIGHT, MAIN_COLOR, SITE_NAME } from "utils/constants";
import { Logo } from "./Logo";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <Container
      as="nav"
      role="contentinfo"
      bg={MAIN_COLOR}
      color="gray.50"
      h={FOOTER_HEIGHT}
      mt={{ base: "1rem", md: "2rem" }}
      position="absolute"
      minW="100%"
      bottom={0}
      left={0}
      right={0}
    >
      <Stack
        spacing="8"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        py={{ base: "12", md: "16" }}
      >
        <Stack spacing={{ base: "6", md: "8" }} align="start">
          <Logo />
          <Text color="muted">
            Referencing the experiences of others can deepen wisdom.
          </Text>
        </Stack>
        <Stack
          direction={{ base: "column-reverse", md: "column", lg: "row" }}
          spacing={{ base: "12", md: "8" }}
        >
          <Stack direction="row" spacing="8">
            <Stack spacing="4" minW="36" flex="1">
              <Text fontSize="sm" fontWeight="semibold" color="subtle">
                Other Product
              </Text>
              <Stack spacing="3" shouldWrapChildren>
                <Link href="/same-grade">
                  <Button variant="link">42 Progress (Developing)</Button>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        pt="8"
        pb="12"
        justify="space-between"
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
      >
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </Text>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="https://github.com/yshima42/42feedback"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
            _hover={{ bg: "gray.700" }}
          />
        </ButtonGroup>
      </Stack>
    </Container>
  );
};

export default Footer;
