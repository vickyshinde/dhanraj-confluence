import {
  Box,
  Grid,
  LoadingOverlay,
  Pagination,
  Card,
  Text,
  Table,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { ExternalLink, Trash, Edit } from "tabler-icons-react";

const ListingPage = () => {
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];
  const [visible, setVisible] = useState(false);
  const [recordList, setRecordList] = useState([]);
  // const [totalCount, setTotalCount] = useState([]);
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

  useEffect(() => {
    const getData = async () => {
      try {
        setVisible(true);
        const response = await getRecordList(controller);
        // console.log(response);
        if (!response.ok)
          throw new Error(`${response.status} Problem with getting data`);
        const data = await response.json();
        console.log(data);
        // setTotalCount(response.headers.get("X-Total-Count"));
        const totalPageCount = Math.ceil(
          response.headers.get("X-Total-Count") / controller.rowsPerPage
        );
        // console.log("totalCount", totalCount);
        setRecordList(data);
        setPerPageCount(totalPageCount);
        setVisible(false);
      } catch (err) {
        console.error(`${err.code} ${err.message} 💥`);
        setApiError(`${err.code} ${err.message} 💥`);
        setVisible(false);
      }
    };
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
      <td style={{ width: "8%" }}>DCT-{item.id.toString().padStart(2, "0")}</td>
      <td style={{ width: "8%" }}>{item.product}</td>
      <td style={{ width: "12%" }}>{item.components}</td>
      <td style={{ width: "auto" }}>{item.category}</td>
      <td style={{ width: "10%" }}>{item.type}</td>
      <td style={{ width: "10%" }}>{item.topic}</td>
      <td>
        <div
          dangerouslySetInnerHTML={{
            __html: item.description.substring(0, 20),
          }}
        />
      </td>
      <td
        style={{
          width: "10%",
        }}
      >
        <Button.Group>
          <Button
            compact
            leftIcon={<Edit size={14} />}
            variant="light"
            color="cyan"
            fullWidth
            title={item.docUrl}
          >
            Edit
          </Button>
          <Button
            compact
            leftIcon={<Trash size={14} />}
            variant="light"
            color="red"
            fullWidth
            title={item.docUrl}
          >
            Delete
          </Button>
        </Button.Group>
      </td>
    </tr>
  ));

  const rows1 = recordList.map((item, index) => (
    <Card shadow="sm" p="lg" mb="lg">
      <Grid>
        <Grid.Col span={6}>
          <Text>
            <b>Product:</b> {item.product}
          </Text>
          <Text>
            <b>components:</b> {item.components}
          </Text>
          <Text>
            <b>category:</b> {item.category}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text>
            <b>type:</b> {item.type}
          </Text>
          <Text>
            <b>topic:</b> {item.topic}
          </Text>
        </Grid.Col>
      </Grid>
      <Text>
        <b>Description:</b>
        <div dangerouslySetInnerHTML={{ __html: item.description }} />
      </Text>

      <Button
        leftIcon={<ExternalLink size={14} />}
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={item.docUrl}
        variant="light"
        color="blue"
        fullWidth
        title={item.docUrl}
        style={{ marginTop: 14 }}
      >
        Document Link
      </Button>
    </Card>
  ));

  return (
    <Box component="div" maw={1200} mx="auto" pos="relative">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      {apiError && apiError}
      <Table mt="xl" striped>
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Components</th>
            <th>Category</th>
            <th>Type</th>
            <th>Topic</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {/* {rows1} */}
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
