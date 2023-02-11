import { Flex, Text } from "@chakra-ui/react";
import { Dispatch } from "react";
import { FeedbackSearchBox } from "./FeedbackSearchBox";
import { FeedbackSortSelect } from "./FeedbackSortSelect";

type Props = {
  dispatch: Dispatch<any>;
  feedbackCount: number;
};

export const FeedbackFilters = ({ dispatch, feedbackCount }: Props) => {
  return (
    <>
      <Flex>
        <FeedbackSearchBox dispatch={dispatch} />
        <FeedbackSortSelect dispatch={dispatch} />
      </Flex>
      <Text opacity={0.6}>{feedbackCount} feedbacks</Text>
    </>
  );
};
