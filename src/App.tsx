import { Title, Space } from "@mantine/core";
import "./App.css";
import AddPage from "./components/addPage";

function App() {
  return (
    <>
      <Title mt="xl" maw={400} mx="auto">
        Welcome to Confluence!
      </Title>
      <AddPage />
    </>
  );
}

export default App;
