import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../../utils/objects";
import { axiosRetryInSSG, fetchAccessToken } from "utils/functions";
import axios from "axios";
import { ScaleTeam } from "types/scaleTeam";

const FEEDBACKS_PER_PAGE = 100;
const MIN_PAGE_SIZE = 100;

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (
  projectId: string,
  accessToken: string,
  pageNum: number,
  pageSize: number
) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}&page[number]=${pageNum}&page[size]=${pageSize}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: ScaleTeam[] = response.data;

  const projectReviews: ProjectReview[] = data.map((value) => {
    return {
      id: value["id"],
      corrector: {
        login: value["corrector"]["login"],
      },
      final_mark: value["final_mark"],
      comment: value["comment"],
    };
  });

  return projectReviews;
};

const getTotalPages = async (
  projectId: string,
  accessToken: string,
  pageSize: number
) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const totalPages = Math.ceil(Number(response.headers["x-total"]) / pageSize);
  return totalPages;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const token = await fetchAccessToken();
  let paths = [];

  for (const project of cursusProjects) {
    const totalPages = await getTotalPages(
      project.slug,
      token.access_token,
      FEEDBACKS_PER_PAGE
    );
    for (let i = 1; i <= totalPages; i++) {
      paths.push({
        params: {
          id: [project.slug, String(i)],
        },
      });
    }
  }
  for (const path of paths) {
    console.log(path);
  }

  return {
    paths,
    // 指定していないパスのページも表示される。ex.ft_containers/1/a
    // TODO:仕様調べる
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  // 引数のバリデーション
  if (!context.params) return { notFound: true };

  const projectId = context.params.id![0];
  const pageNum = Number(context.params.id![1]);
  if (!cursusProjects.find((project) => project.slug === projectId)) {
    return { notFound: true };
  }

  // データの取得
  try {
    axiosRetryInSSG();

    const token = await fetchAccessToken();
    const projectReviews = await fetchProjectReviews(
      projectId,
      token.access_token,
      pageNum,
      FEEDBACKS_PER_PAGE
    );

    return {
      props: { projectReviews },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

type Props = {
  projectReviews: ProjectReview[];
};

const FeedbackComments = (props: Props) => {
  const { projectReviews } = props;

  if (!projectReviews) {
    return <p>{"Error"}</p>;
  }

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Heading>review-comments</Heading>
      <div>
        {projectReviews.map((value: ProjectReview) => (
          <div key={value["id"]}>
            {value["corrector"]["login"]}
            <br />
            final_mark: {value["final_mark"]}
            <br />
            comment: {value["comment"]}
            <br />
            <br />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default FeedbackComments;
