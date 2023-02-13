import { Layout } from "@/components/Layout";
import { GetStaticProps } from "next";
import { SITE_NAME } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchScaleTeams } from "utils/functions";
import { CursusUser } from "types/cursusUsers";
import { Feedback } from "types/Feedback";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import { FeedbackFilters } from "@/features/feedbacks/components/FeedbackFilters";
import { PaginatedFeedbackList } from "@/features/feedbacks/components/PaginatedFeedbackList";
import { useFeedbacksReducer } from "@/features/feedbacks/hooks/useFeedbacks";

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

type Props = {
  feedbacks: Feedback[];
  projectName: string;
};

const Feedbacks = ({ feedbacks, projectName }: Props) => {
  const [state, dispatch] = useFeedbacksReducer(feedbacks);
  const {
    matchingFeedbacks,
    searchCriteria: { searchWord },
  } = state;

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
          feedbackCount={matchingFeedbacks.length}
        />
        <PaginatedFeedbackList
          feedbacks={matchingFeedbacks}
          searchWord={searchWord}
        />
      </Layout>
    </>
  );
};

export default Feedbacks;
