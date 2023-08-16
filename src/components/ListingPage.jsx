import {
  Box,
  Grid,
  LoadingOverlay,
  Pagination,
  Card,
  Text,
  Table,
  Button,
  TextInput,
  Select,
  useMantineTheme,
  TypographyStylesProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  Trash,
  Edit,
  ChevronDown,
  ChevronUp,
} from "tabler-icons-react";
import { generateHTML, JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

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

  const [sortActive, setSortActive] = useState({
    columnName: "",
    sortBy: "",
  });

  useEffect(() => {
    setSortActive({
      columnName: controller.sortColumn,
      sortBy: controller.order,
    });
  }, [controller]);
  console.log(sortActive);
  const sorting = (col) => {
    setController({
      ...controller,
      sortColumn: col,
      order: controller.order === "asc" ? "desc" : "asc",
      currentPage: 1,
    });
  };

  const searchItems = (searchValue) => {
    setController({
      ...controller,
      searchInput: searchValue,
      currentPage: 1,
    });
    // highlightText
  };

  const showActive = (active) => {
    if (sortActive.columnName === active && sortActive.sortBy === "asc") {
      return <ChevronUp size={14} />;
    } else if (
      sortActive.columnName === active &&
      sortActive.sortBy === "desc"
    ) {
      return <ChevronDown size={14} />;
    } else {
      return (
        <Box
          sx={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}
        >
          <ChevronUp size={14} />
          <ChevronDown size={14} />
        </Box>
      );
    }
  };

  const rows = recordList.map((item, index) => (
    <tr key={item.id}>
      <td style={{ width: "8%" }}>DCT-{item.id.toString().padStart(2, "0")}</td>
      <td style={{ width: "auto" }}>{item.topic}</td>
      <td style={{ width: "10%" }}>{item.product}</td>
      <td style={{ width: "12%" }}>{item.components}</td>
      <td style={{ width: "15%" }}>{item.category}</td>
      <td style={{ width: "10%" }}>{item.type}</td>
      {/* <td>
        <TypographyStylesProvider>
          <div
            dangerouslySetInnerHTML={{
              __html: generateHTML(item.description, [
                StarterKit,
                Underline,
                Superscript,
                SubScript,
                Highlight,
                Color,
                TextStyle,
              ]),
            }}
          />
        </TypographyStylesProvider>
      </td> */}
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

  return (
    <Box component="div" maw={1200} mx="auto" pos="relative">
      <Grid>
        <Grid.Col span={2}>
          <TextInput
            label="Type"
            placeholder="type"
            withAsterisk
            mt="md"
            onChange={(e) => searchItems(e.target.value)}
            value={controller.searchInput}
          />
        </Grid.Col>
      </Grid>

      <LoadingOverlay visible={visible} overlayBlur={2} />
      {apiError && apiError}
      <Table mt="xl" striped>
        <thead>
          <tr>
            <th onClick={() => sorting("id")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                No{showActive("id")}
              </Box>
            </th>
            <th onClick={() => sorting("topic")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                Title{showActive("topic")}
              </Box>
            </th>
            <th onClick={() => sorting("product")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                Product{showActive("product")}
              </Box>
            </th>
            <th onClick={() => sorting("components")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                Components{showActive("components")}
              </Box>
            </th>
            <th onClick={() => sorting("category")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                Category{showActive("category")}
              </Box>
            </th>
            <th onClick={() => sorting("type")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                Type{showActive("type")}
              </Box>
            </th>

            <th>Action</th>
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
