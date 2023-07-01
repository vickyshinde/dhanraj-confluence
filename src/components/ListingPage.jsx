import { Box, Table, LoadingOverlay, Pagination } from "@mantine/core";
import { useEffect, useState } from "react";

const ListingPage = () => {
  const [visible, setVisible] = useState(false);
  const [recordList, setRecordList] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [perPageCount, setPerPageCount] = useState([]);
  const [apiError, setApiError] = useState("");
  const [controller, setController] = useState({
    currentPage: 1,
    rowsPerPage: 10,
    searchInput: "",
    sortColumn: "",
    order: "",
  });

  const getRecordList = (controller) => {
    const { currentPage, rowsPerPage, searchInput, sortColumn, order } =
      controller;
    const url = `http://localhost:4040/lists?_page=${currentPage}&_limit=${rowsPerPage}&q=${searchInput}&_sort=${sortColumn}&_order=${order}`;
    console.log("url", url, controller);
    return fetch(url);
  };

  const getData = async () => {
    try {
      setVisible(true);
      const response = await getRecordList(controller);
      // console.log(response);
      if (!response.ok)
        throw new Error(`${response.status} Problem with getting data`);
      const data = await response.json();
      console.log(data);
      setTotalCount(response.headers.get("X-Total-Count"));
      const totalPageCount = Math.ceil(
        response.headers.get("X-Total-Count") / controller.rowsPerPage
      );
      console.log("totalCount", totalCount);
      setRecordList(data);
      setPerPageCount(totalPageCount);
      setVisible(false);
    } catch (err) {
      console.error(`${err.code} ${err.message} 💥`);
      setApiError(`${err.code} ${err.message} 💥`);
      setVisible(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      getData();
    }, 500);
    return () => clearTimeout(debounce);
  }, [controller]);

  const handlePageChange = (newPage) => {
    setVisible(true);
    setController({
      ...controller,
      currentPage: newPage,
    });
  };

  const rows = recordList.map((item, index) => (
    <tr key={item.id}>
      <td>{(index + 1).toString().padStart(2, "0")}</td>
      <td>{item.product}</td>
      <td>{item.components}</td>
      <td>{item.category}</td>
      <td>{item.type}</td>
      <td>{item.topic}</td>
      <td>{item.description}</td>
      <td>
        <a href={item.docUrl} target="_blank" rel="noreferrer">
          {item.docUrl}
        </a>
      </td>
    </tr>
  ));
  return (
    <Box component="div" maw={1200} mx="auto" pos="relative">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      {apiError && apiError}
      <Table mt="xl">
        <thead>
          <tr>
            <th>Sr. no</th>
            <th>Product</th>
            <th>Components</th>
            <th>Category</th>
            <th>Type</th>
            <th>Topic</th>
            <th>Description</th>
            <th>Doc Url</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Pagination
        position="center"
        mt="xl"
        mb="xl"
        value={controller.currentPage}
        onChange={handlePageChange}
        total={perPageCount}
      />
    </Box>
  );
};

export default ListingPage;
