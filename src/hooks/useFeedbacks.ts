import escapeStringRegexp from "escape-string-regexp";
import { Dispatch, useReducer } from "react";
import { CompareFunc, Feedback, SortType } from "types/Feedback";

export type FeedbacksState = {
  searchWord: string;
  sortType: SortType;
  allFeedbacks: Feedback[];
  filteredFeedbacks: Feedback[];
};

export type FeedbacksAction =
  | {
      type: "INPUT";
      searchWord: string;
    }
  | {
      type: "INPUT_COMPOSITION";
      newWord: string;
    }
  | {
      type: "SELECT";
      sortType: SortType;
    };

type FilterCondition = Omit<
  FeedbacksState,
  "allFeedbacks" | "filteredFeedbacks"
>;

const sortTypeToCompareFunc = new Map<SortType, CompareFunc>([
  [SortType.UpdateAtAsc, (a, b) => a.updated_at.localeCompare(b.updated_at)],
  [SortType.UpdateAtDesc, (a, b) => b.updated_at.localeCompare(a.updated_at)],
  [SortType.CommentLengthASC, (a, b) => a.comment.length - b.comment.length],
  [SortType.CommentLengthDesc, (a, b) => b.comment.length - a.comment.length],
  [SortType.None, (a, b) => 0],
]);

const includesSearchKeyword = (feedback: Feedback, searchWord: string) => {
  // 入力された文字列を安全に正規表現に変換
  const escapedSearchKeyword = escapeStringRegexp(searchWord);
  const regex = new RegExp(escapedSearchKeyword, "i");
  return feedback.comment.match(regex) || feedback.corrector.login.match(regex);
};

const feedbacksReducer = (
  state: FeedbacksState,
  action: FeedbacksAction
): FeedbacksState => {
  const filterFeedbacks = (filterCondition: FilterCondition) => {
    return state.allFeedbacks
      .filter((feedback) =>
        includesSearchKeyword(feedback, filterCondition.searchWord)
      )
      .sort(sortTypeToCompareFunc.get(filterCondition.sortType));
  };

  switch (action.type) {
    case "INPUT": {
      const newSearchWord = action.searchWord;
      const newFilteredFeedbacks = filterFeedbacks({
        searchWord: newSearchWord,
        sortType: state.sortType,
      });

      return {
        ...state,
        searchWord: newSearchWord,
        filteredFeedbacks: newFilteredFeedbacks,
      };
    }
    case "INPUT_COMPOSITION": {
      const newSearchWord = state.searchWord + action.newWord;
      const newFilteredFeedbacks = filterFeedbacks({
        searchWord: newSearchWord,
        sortType: state.sortType,
      });

      return {
        ...state,
        searchWord: newSearchWord,
        filteredFeedbacks: newFilteredFeedbacks,
      };
    }
    case "SELECT": {
      const newSortType = action.sortType;
      const newFilteredFeedbacks = filterFeedbacks({
        searchWord: state.searchWord,
        sortType: newSortType,
      });

      return {
        ...state,
        sortType: newSortType,
        filteredFeedbacks: newFilteredFeedbacks,
      };
    }
    default:
      throw new Error("invalid action type");
  }
};

export const useFeedbacks = (
  initialState: FeedbacksState
): [FeedbacksState, Dispatch<FeedbacksAction>] => {
  const [state, dispatch] = useReducer(feedbacksReducer, initialState);

  return [state, dispatch];
};
