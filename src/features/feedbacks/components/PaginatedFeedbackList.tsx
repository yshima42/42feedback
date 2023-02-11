import { Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Feedback } from "types/Feedback";
import { FEEDBACKS_PER_PAGE } from "utils/constants";
import { FeedbackList } from "./FeedbackList";

type Props = {
  searchWord: string;
  targetFeedbacks: Feedback[];
};

export const PaginatedFeedbackList = ({
  searchWord,
  targetFeedbacks,
}: Props) => {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + FEEDBACKS_PER_PAGE;
  const currentItems = targetFeedbacks.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(targetFeedbacks.length / FEEDBACKS_PER_PAGE);
  const isPaginationDisabled = pageCount <= 1;

  const handlePageChange = (event: { selected: number }) => {
    const newOffset =
      (event.selected * FEEDBACKS_PER_PAGE) % targetFeedbacks.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [targetFeedbacks]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [itemOffset]);

  return (
    <>
      <FeedbackList feedbacks={currentItems} searchWord={searchWord} />
      <Center>
        {isPaginationDisabled ? (
          <></>
        ) : (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageChange}
            // 検索、ソート条件が変更されたときにページネーションの表示をリセットするために
            forcePage={itemOffset / FEEDBACKS_PER_PAGE}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        )}
      </Center>
    </>
  );
};
