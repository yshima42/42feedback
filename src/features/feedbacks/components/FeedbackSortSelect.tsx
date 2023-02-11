import { FeedbacksAction } from "@/hooks/useFeedbacks";
import { Select } from "@chakra-ui/react";
import { Dispatch } from "react";
import { SortType } from "types/Feedback";

type Props = {
  dispatch: Dispatch<FeedbacksAction>;
};

export const FeedbackSortSelect = ({ dispatch }: Props) => {
  return (
    <Select
      width={180}
      marginLeft={0.5}
      textAlign={"center"}
      backgroundColor={"gray.100"}
      placeholder={"⇅ Sort"}
      onChange={(event) =>
        dispatch({ type: "SELECT", sortType: event.target.value as SortType })
      }
      fontSize="sm"
    >
      <option value={SortType.UpdateAtDesc}>Date(Desc)</option>
      <option value={SortType.UpdateAtAsc}>Date(Asc)</option>
      <option value={SortType.CommentLengthDesc}>Length(Desc)</option>
      <option value={SortType.CommentLengthASC}>Length(Asc)</option>
    </Select>
  );
};
