import { useNavigate, Outlet } from "react-router-dom";
import { Title, Button, Card, Grid } from "@mantine/core";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <Card shadow="sm" p="lg" mb="lg">
        <Grid>
          <Grid.Col span={6}>
            <Title>Welcome to Confluence!</Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <Button.Group
              sx={{
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={() => navigate("/")}>Add</Button>
              <Button onClick={() => navigate("/listing")}>List</Button>
            </Button.Group>
          </Grid.Col>
        </Grid>
      </Card>
      <Outlet />
    </>
  );
}

export default App;
