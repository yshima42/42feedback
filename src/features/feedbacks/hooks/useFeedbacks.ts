import escapeStringRegexp from "escape-string-regexp";
import { Dispatch, useReducer } from "react";
import { Feedback, SortType } from "types/Feedback";

type SearchCriteria = {
  searchWord: string;
  sortType: SortType;
};

export type FeedbacksState = {
  searchCriteria: SearchCriteria;
  allFeedbacks: Feedback[];
  matchingFeedbacks: Feedback[];
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

type CompareFunc = (a: Feedback, b: Feedback) => number;

const compareFuncs = new Map<SortType, CompareFunc>([
  [SortType.UpdateAtAsc, (a, b) => a.updated_at.localeCompare(b.updated_at)],
  [SortType.UpdateAtDesc, (a, b) => b.updated_at.localeCompare(a.updated_at)],
  [SortType.CommentLengthASC, (a, b) => a.comment.length - b.comment.length],
  [SortType.CommentLengthDesc, (a, b) => b.comment.length - a.comment.length],
  [SortType.None, (a, b) => 0],
]);

const includesSearchWord = (feedback: Feedback, searchWord: string) => {
  // 入力された文字列を安全に正規表現に変換
  const escapedSearchKeyword = escapeStringRegexp(searchWord);
  const regex = new RegExp(escapedSearchKeyword, "i");
  return feedback.comment.match(regex) || feedback.corrector.login.match(regex);
};

const searchFeedbacks = (
  allFeedbacks: Feedback[],
  searchCriteria: SearchCriteria
) => {
  return allFeedbacks
    .filter((feedback) =>
      includesSearchWord(feedback, searchCriteria.searchWord)
    )
    .sort(compareFuncs.get(searchCriteria.sortType));
};

const reducer = (
  state: FeedbacksState,
  action: FeedbacksAction
): FeedbacksState => {
  // ここでstateをディープコピーしているのは、reducerを純粋関数にするため
  // (https://beta.reactjs.org/reference/react/useReducer#my-reducer-or-initializer-function-runs-twice)
  let newSearchCriteria: SearchCriteria = {
    searchWord: "for initialize",
    sortType: SortType.UpdateAtDesc,
  };
  Object.assign(newSearchCriteria, state.searchCriteria);

  switch (action.type) {
    case "INPUT": {
      newSearchCriteria.searchWord = action.searchWord;
      break;
    }
    case "INPUT_COMPOSITION": {
      newSearchCriteria.searchWord += action.newWord;
      break;
    }
    case "SELECT": {
      newSearchCriteria.sortType = action.sortType;
      break;
    }
    default:
      throw new Error("invalid action type");
  }
  return {
    ...state,
    searchCriteria: newSearchCriteria,
    matchingFeedbacks: searchFeedbacks(state.allFeedbacks, newSearchCriteria),
  };
};

export const useFeedbacksReducer = (
  feedbacks: Feedback[]
): [FeedbacksState, Dispatch<FeedbacksAction>] => {
  const initialState = {
    searchCriteria: {
      searchWord: "",
      sortType: SortType.UpdateAtDesc,
    },
    allFeedbacks: feedbacks,
    matchingFeedbacks: feedbacks,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch];
};
