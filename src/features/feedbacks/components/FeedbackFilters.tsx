import { FeedbacksAction } from "@/features/feedbacks/hooks/useFeedbacks";
import { Flex, Text } from "@chakra-ui/react";
import { Dispatch } from "react";
import { FeedbackSearchInput } from "./FeedbackSearchInput";
import { FeedbackSortSelect } from "./FeedbackSortSelect";

type Props = {
  dispatch: Dispatch<FeedbacksAction>;
  feedbackCount: number;
};

export const FeedbackFilters = ({ dispatch, feedbackCount }: Props) => {
  return (
    <>
      <Flex>
        <FeedbackSearchInput dispatch={dispatch} />
        <FeedbackSortSelect dispatch={dispatch} />
      </Flex>
      <Text opacity={0.6}>{feedbackCount} feedbacks</Text>
    </>
  );
};
