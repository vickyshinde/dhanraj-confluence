import { Title, Space } from "@mantine/core";
import "./App.css";
import Add from "./components/add";

function App() {
  return (
    <>
      <Title mt="xl" maw={400} mx="auto">
        Welcome to Confluence!
      </Title>
      <Add />
    </>
  );
}

export default App;
