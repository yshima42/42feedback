import { DragHandleIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";

type Props = {
  setIsList: React.Dispatch<React.SetStateAction<boolean>>;
  isList: boolean;
};

export const ListGridSwitch: React.FC<Props> = (props) => {
  const { setIsList, isList } = props;

  return (
    <Box>
      <IconButton
        aria-label="setList"
        size="xs"
        icon={<HamburgerIcon />}
        onClick={() => setIsList(true)}
        isActive={isList}
        rounded="none"
      >
        {isList ? "List" : "Grid"}
      </IconButton>
      <IconButton
        aria-label="unsetList"
        size="xs"
        icon={<DragHandleIcon />}
        onClick={() => setIsList(false)}
        isActive={!isList}
        rounded="none"
      >
        {isList ? "List" : "Grid"}
      </IconButton>
    </Box>
  );
};
