import { FeedbackCard } from "@/features/feedbacks/components/FeedbackCard";
import { Box } from "@chakra-ui/react";
import { Feedback } from "types/Feedback";

type Props = {
  feedbacks: Feedback[];
  searchWord: string;
};

export const FeedbackList = ({ feedbacks, searchWord }: Props) => {
  return (
    <>
      {feedbacks.map((projectFeedback: Feedback) => (
        <Box key={projectFeedback.id} mb={8}>
          <FeedbackCard feedback={projectFeedback} searchWord={searchWord} />
        </Box>
      ))}
    </>
  );
};
