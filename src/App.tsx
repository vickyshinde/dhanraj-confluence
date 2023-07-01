import { Outlet } from "react-router-dom";
import { Title } from "@mantine/core";
import "./App.css";

function App() {
  return (
    <>
      <Title mt="xl" maw={400} mx="auto">
        Welcome to Confluence!
      </Title>
      <Outlet />
    </>
  );
}

export default App;
