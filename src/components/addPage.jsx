import { useForm, isNotEmpty } from "@mantine/form";

import {
  LoadingOverlay,
  Button,
  Group,
  TextInput,
  Text,
  Box,
  Space,
  Select,
  Grid,
  Input,
  Notification,
  FileInput,
  TypographyStylesProvider,
  FileButton,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import Editor from "../shared/Editor";

import RichTextEditorComp from "../shared/RichTextEditor";

function AddPage() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorState, setEditorState] = useState();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // const [submittedValues, setSubmittedValues] = useState("");
  const [visible, setVisible] = useState(false);
  const [displayUserMsg, setDisplayUserMsg] = useState({
    show: false,
    icon: "",
    clsName: "",
    msg: "",
  });

  const addRecord = (newEntry) => {
    const url = "http://localhost:4040/lists";
    // console.log(newUser);
    return fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });
  };

  const form1 = "texts";
  const form = useForm({
    initialValues: {
      product: "",
      components: "",
      category: "",
      type: "",
      topic: "",
      description: "",
      docUrl: "",
      file: null,
    },

    validate: {
      product: isNotEmpty("Enter product"),
      components: isNotEmpty("Enter components"),
      category: isNotEmpty("Enter category"),
      // type: isNotEmpty("Enter type"),
      topic: isNotEmpty("Enter topic"),
      // description: isNotEmpty("Enter description"),
      docUrl: isNotEmpty("Enter docUrl"),
    },

    transformValues: (values) => ({
      product: values.product,
      components: values.components,
      category: values.category,
      type: values.type,
      topic: values.topic,
      description: values.description,
      // description: editorState,
      docUrl: values.docUrl,
      file: File | null,
    }),
  });

  const onSubmit = async (values) => {
    try {
      setVisible(true);
      const response = await addRecord(values);
      console.log(response);
      if (!response.ok)
        throw new Error(`${response.status} Problem with getting data`);
      // console.log(data);
      setDisplayUserMsg({
        show: true,
        icon: <IconCheck size="1.1rem" />,
        color: "teal",
        msg: "User added successfully (submitted)",
      });
      form.reset();
      setEditorState("");
      setVisible(false);
    } catch (err) {
      setDisplayUserMsg({
        show: true,
        icon: <IconX size="1.1rem" />,
        color: "red",
        msg: "Please fill all the required fields (inValid form)",
      });
      setVisible(false);
      console.error(`${err.message} 💥`);
    }
  };

  return (
    <Box
      component="form"
      maw={1200}
      mx="auto"
      pos="relative"
      onSubmit={form.onSubmit(onSubmit)}
    >
      {displayUserMsg.show && (
        <>
          <Notification
            withCloseButton={false}
            icon={displayUserMsg.icon}
            color={displayUserMsg.color}
            title={displayUserMsg.msg}
            closeButtonProps={{ title: "Hide notification" }}
          />
          <Space h="xl" />
        </>
      )}
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <Grid>
        <Grid.Col span={3}>
          <Select
            {...form.getInputProps("product")}
            withAsterisk
            label="Product"
            placeholder="Select"
            mt="md"
            data={[
              { value: "RTSP", label: "RTSP" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            {...form.getInputProps("components")}
            withAsterisk
            label="Components"
            placeholder="Select"
            mt="md"
            data={[
              { value: "Switch", label: "Switch" },
              { value: "TOMAS", label: "TOMAS" },
              { value: "BIG", label: "BIG" },
              { value: "Admin Portal", label: "Admin Portal" },
              { value: "Merchant Portal", label: "Merchant Portal" },
              { value: "CBDC App", label: "CBDC App" },
              { value: "NGINX", label: "NGINX" },
              { value: "Bundle", label: "Bundle" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            {...form.getInputProps("category")}
            withAsterisk
            label="Category"
            placeholder="Select"
            mt="md"
            data={[
              { value: "react", label: "Test Cases" },
              {
                value: "Functional Requirement Document",
                label: "Functional Requirement Document",
              },
              {
                value: "svelte",
                label: "Functional Requirement Specification",
              },
              {
                value: "Business Requirement Specification",
                label: "Business Requirement Specification",
              },
              {
                value: "Requirement specific DOU",
                label: "Requirement specific DOU",
              },
              { value: "Flowchat", label: "Flowchat" },
              { value: "Activity Diagram", label: "Activity Diagram" },
              { value: "Deployment Process", label: "Deployment Process" },
              {
                value: "Server Start / Stop Process",
                label: "Server Start / Stop Process",
              },
              {
                value: "Error and Response Codes",
                label: "Error and Response Codes",
              },
              { value: "Release Notes", label: "Release Notes" },
              { value: "Sequence Diagram", label: "Sequence Diagram" },
              { value: "API Document", label: "API Document" },
              { value: "API Collection", label: "API Collection" },
              { value: "Environment Details", label: "Environment Details" },
              {
                value: "Success Transaction Logs",
                label: "Success Transaction Logs",
              },
              {
                value: "Testing Transaction Logs",
                label: "Testing Transaction Logs",
              },
              { value: "Learning Document", label: "Learning Document" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="Type"
            placeholder="type"
            // withAsterisk
            mt="md"
            {...form.getInputProps("type")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Title"
            placeholder="Title"
            withAsterisk
            mt="md"
            {...form.getInputProps("topic")}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            {...form.getInputProps("docUrl")}
            withAsterisk
            label="Doc For"
            placeholder="Select"
            mt="md"
            data={[
              { value: "Core", label: "Core" },
              { value: "ICICI", label: "ICICI" },
              { value: "IDFC", label: "IDFC" },
              { value: "Yes Bank", label: "Yes Bank" },
              { value: "SBI", label: "SBI" },
              { value: "IndusInd", label: "IndusInd" },
            ]}
          />
        </Grid.Col>
        {/* <Grid.Col span={3}>
          <FileInput
            mt="md"
            placeholder="Pick file"
            label="Upload File"
            {...form.getInputProps("file  ")}
          />
        </Grid.Col> */}

        <Grid.Col span={12}>
          <Input.Wrapper label="Description" mt="md">
            <RichTextEditorComp name="description" form={form} />
            {/* <Editor
              name="description"
              onChange={(data) => {
                setEditorState(data);
              }}
              editorLoaded={editorLoaded}
            /> */}
          </Input.Wrapper>

          
        </Grid.Col>
      </Grid>

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </Box>
  );
}

export default AddPage;
