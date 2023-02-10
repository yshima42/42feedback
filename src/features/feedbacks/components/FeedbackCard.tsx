import { Avatar, Box, Flex, Highlight, Spacer, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Feedback } from "types/Feedback";
import { HIGHLIGHT_COLOR } from "utils/constants";

type Props = {
  feedback: Feedback;
  searchWord: string;
};

export const FeedbackCard = ({ feedback, searchWord }: Props) => {
  // propsとしてDate型を渡すと、errorになるので、stringとして取ってきている
  const date = new Date(feedback.updated_at);

  return (
    <Box marginY={2}>
      <Flex>
        <Avatar src={feedback.corrector.image} />
        <Box alignSelf="end">
          <Flex px="2" alignItems="end">
            <Text display={{ base: "none", md: "flex" }} fontSize="md">
              Evaluated by{" "}
            </Text>
            <Link
              href={`https://profile.intra.42.fr/users/${feedback.corrector.login}`}
              target="_blank"
            >
              <Text px="1" fontSize="md" fontWeight="bold">
                <Highlight
                  query={searchWord}
                  styles={{ px: "1", py: "1", bg: HIGHLIGHT_COLOR }}
                >
                  {feedback.corrector.login}
                </Highlight>
              </Text>
            </Link>
            <Text fontSize="xs">{date.toDateString()}</Text>
          </Flex>
        </Box>
        <Spacer />
        <Box alignSelf="end">
          <Flex>
            <Link
              href={`https://projects.intra.42.fr/projects/${feedback.slug}/projects_users/${feedback.projects_user_id}`}
              target="_blank"
            >
              <ExternalLinkIcon boxSize={3.5} />
            </Link>
          </Flex>
        </Box>
      </Flex>
      <Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        whiteSpace="pre-wrap"
      >
        <Highlight
          query={searchWord}
          styles={{ px: "1", py: "1", bg: HIGHLIGHT_COLOR }}
        >
          {feedback.comment}
        </Highlight>
      </Box>
    </Box>
  );
};
