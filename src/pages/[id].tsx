import { Layout } from "@/components/Layout";
import { GetStaticProps } from "next";
import { SITE_NAME } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchScaleTeams } from "utils/functions";
import { useReducer } from "react";
import { CursusUser } from "types/cursusUsers";
import { CompareFunc, Feedback, SortType } from "types/Feedback";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import escapeStringRegexp from "escape-string-regexp";
import { FeedbackFilters } from "@/features/feedbacks/components/FeedbackFilters";
import { PaginatedFeedbackList } from "@/features/feedbacks/components/PaginatedFeedbackList";

const isValidScaleTeam = (scaleTeam: ScaleTeam) => {
  if (
    scaleTeam.comment !== null &&
    cursusUsers.find(
      (cursusUser) => cursusUser.user.login === scaleTeam.corrector.login
    )
  ) {
    return true;
  }
  return false;
};

const makeFeedbacks = (
  slug: string,
  scaleTeams: ScaleTeam[],
  cursusUsers: CursusUser[]
) => {
  // 42apiのバグでcursus_usersの中に存在しないユーザーがいる場合があるので、その場合のvalidate処理
  const validScaleTeams = scaleTeams.filter(isValidScaleTeam);

  const feedbacks = validScaleTeams.map((value: ScaleTeam) => {
    const login = value.corrector.login;

    const targetCursusUser = cursusUsers.find(
      (cursusUser) => cursusUser.user.login === login
    );

    const image = targetCursusUser!.user.image.versions.small ?? "";

    return {
      id: value.id,
      slug: slug,
      updated_at: value.updated_at,
      corrector: {
        login: login,
        image: image,
      },
      comment: value.comment,
      projects_user_id: value.team.users[0].projects_user_id,
    };
  });

  return feedbacks;
};

export const getStaticPaths = async () => {
  const paths = cursusProjects.map((project) => {
    return {
      params: {
        id: project.name,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  // 引数のバリデーション
  if (!context.params) {
    return { notFound: true };
  }
  const name = context.params.id as string;
  const slug = cursusProjects.find((project) => project.name === name)?.slug;
  if (!slug) {
    return { notFound: true };
  }
  // データの取得
  try {
    axiosRetryInSSG();
    const scaleTeams = await fetchScaleTeams(slug, token.access_token);
    const feedbacks = makeFeedbacks(slug, scaleTeams, cursusUsers);

    return {
      props: { feedbacks, projectName: name },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

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

type Props = {
  feedbacks: Feedback[];
  projectName: string;
};

type State = {
  searchWord: string;
  sortType: SortType;
  allFeedbacks: Feedback[];
  filteredFeedbacks: Feedback[];
};

type Action =
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

type FilterCondition = Omit<State, "allFeedbacks" | "filteredFeedbacks">;

const feedbacksReducer = (state: State, action: Action): State => {
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

const Feedbacks = ({ feedbacks, projectName }: Props) => {
  const [state, dispatch] = useReducer(feedbacksReducer, {
    searchWord: "",
    sortType: SortType.UpdateAtDesc,
    allFeedbacks: feedbacks,
    filteredFeedbacks: feedbacks,
  });

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>
          {projectName} - {SITE_NAME}
        </title>
      </Head>
      <Layout pageTitle={projectName}>
        <FeedbackFilters
          dispatch={dispatch}
          feedbackCount={state.filteredFeedbacks.length}
        />
        <PaginatedFeedbackList
          targetFeedbacks={state.filteredFeedbacks}
          searchWord={state.searchWord}
        />
      </Layout>
    </>
  );
};

export default Feedbacks;
