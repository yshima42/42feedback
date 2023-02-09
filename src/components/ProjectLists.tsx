import {
  Box,
  Button,
  ListItem,
  Text,
  UnorderedList,
  Wrap as List,
  WrapItem,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  cursusProjects: {
    name: string;
    slug: string;
    rank: number;
  }[];
  designatedRank: number;
};

export const ProjectLists: React.FC<Props> = (props) => {
  const { cursusProjects, designatedRank } = props;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">
        Rank {designatedRank}
      </Text>
      <UnorderedList>
        {cursusProjects
          .filter((value) => value.rank === designatedRank)
          .map((cursusProject) => (
            <ListItem key={cursusProject.name}>
              <Link href={`/${cursusProject.name}`}>
                <Text color="blue.500" fontSize="lg">
                  {cursusProject.name}
                </Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
    </Box>
  );
};
