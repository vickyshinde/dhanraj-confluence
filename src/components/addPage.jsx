import { useForm, isNotEmpty } from "@mantine/form";
import JoditEditor from "jodit-react";

import {
  LoadingOverlay,
  Button,
  Group,
  TextInput,
  Box,
  Space,
  Select,
  Grid,
  Input,
  Notification,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

import { useRef, useState } from "react";

function AddPage() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
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

  const form = useForm({
    initialValues: {
      product: "",
      components: "",
      category: "",
      type: "",
      topic: "",
      description: "",
      docUrl: "",
    },

    validate: {
      product: isNotEmpty("Enter product"),
      components: isNotEmpty("Enter components"),
      category: isNotEmpty("Enter category"),
      type: isNotEmpty("Enter type"),
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
      description: content,
      docUrl: values.docUrl,
    }),
  });

  const onSubmit = async (values) => {
    try {
      setVisible(true);
      const response = await addRecord(values);
      // console.log(response);
      if (!response.ok)
        throw new Error(`${response.status} Problem with getting data`);
      // console.log(data);
      setDisplayUserMsg({
        show: true,
        icon: <IconCheck size="1.1rem" />,
        color: "teal",
        msg: "User added successfully (submitted)",
      });
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
        <Grid.Col span={6}>
          <Select
            {...form.getInputProps("product")}
            withAsterisk
            label="Product"
            placeholder="Select"
            mt="md"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
          <Select
            {...form.getInputProps("components")}
            withAsterisk
            label="Components"
            placeholder="Select"
            mt="md"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
          <Select
            {...form.getInputProps("category")}
            withAsterisk
            label="Category"
            placeholder="Select"
            mt="md"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Type"
            placeholder="type"
            withAsterisk
            mt="md"
            {...form.getInputProps("type")}
          />
          <TextInput
            label="Topic"
            placeholder="topic"
            withAsterisk
            mt="md"
            {...form.getInputProps("topic")}
          />
          <TextInput
            label="Doc Url"
            placeholder="docUrl"
            withAsterisk
            mt="md"
            {...form.getInputProps("docUrl")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Input.Wrapper label="Description" mt="md">
            <JoditEditor
              height={800}
              ref={editor}
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
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
