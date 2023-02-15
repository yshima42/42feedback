import { FeedbacksAction } from "@/features/feedbacks/hooks/useFeedbacks";
import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import { INPUT_MAX_LENGTH } from "utils/constants";

type Props = {
  dispatch: Dispatch<FeedbacksAction>;
};

export const FeedbackSearchInput = ({ dispatch }: Props) => {
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    dispatch({ type: "INPUT", searchWord: event.target.value });
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    dispatch({ type: "INPUT_COMPOSITION", newWord: event.data });
  };

  return (
    <InputGroup size="md" marginBottom={2}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="login or comment"
        maxLength={INPUT_MAX_LENGTH}
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </InputGroup>
  );
};
