import React, { useState } from "react";
import { Flex, Group, Text, rem, Image, Button, ScrollArea, Highlight } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { uploadFile } from "../../api/upload";
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export default function Uploadcv(props) {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleDrop = (files) => {
    setAcceptedFiles(files);
    setQuestionsAndAnswers([]); // Reset questions and answers on new drop
    console.log("accepted files", files);
  };

  const handleReject = () => {
    setAcceptedFiles([]);
    setQuestionsAndAnswers([]);
    console.log("rejected files");
  };

  const handleGenerateQuestions = async () => {
    if (acceptedFiles.length === 0) {
      console.log("No file to upload.");
      return;
    }

    setLoading(true); // Set loading to true when starting to generate questions

    const file = acceptedFiles[0]; // Assume only one file is dropped

    const id = notifications.show({
      loading: true,
      title: 'Generating Answers from Questions',
      message: 'Please wait...',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const response = await uploadFile(file);
      console.log("API Response:", response); // Log the response

      if (response && response.data && response.data.length > 0) {
        setQuestionsAndAnswers(response.data); // Update state with API response

        notifications.update({
          id,
          color: 'teal',
          title: 'Success',
          message: 'Answers have been generated successfully!',
          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
          loading: false,
          autoClose: 5000,
        });
      } else {
        console.log("No questions and answers returned from API.");
        setQuestionsAndAnswers([]);

        notifications.update({
          id,
          color: 'red',
          title: 'Error',
          message: 'Invalid response from API. No questions and answers returned.',
          icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
          loading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setQuestionsAndAnswers([]);

      notifications.update({
        id,
        color: 'red',
        title: 'Error',
        message: 'An error occurred while uploading the file. Please try again.',
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false); // Set loading to false after generating questions (success or failure)
    }
  };


  return (
    <>
      <Flex style={{ height: "100%" }}>
        {/* Left Pane: Dropzone */}
        <Flex direction="column" gap="sm" style={{ flex: 1, padding: "1rem 2rem", alignItems: "stretch" }}>
          <Dropzone
            onDrop={handleDrop}
            onReject={handleReject}
            maxSize={5 * 1024 ** 2}
            accept="image/png,image/jpeg"
            {...props}
          >
            <Group
              justify="center"
              gap="xl"
              mih={200}
              style={{ pointerEvents: "none", textAlign: "center" }}
            >
              {acceptedFiles.length === 0 && (
                <>
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-blue-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-red-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <Flex align="center" gap="1rem" direction="column">
                      <IconPhoto
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                      />
                      <div>
                        <Text size="xl" inline>
                          Drag images here or click to select files
                        </Text>
                      </div>
                    </Flex>
                  </Dropzone.Idle>
                </>
              )}
              {acceptedFiles.length > 0 && (
                <Flex direction="column" align="center" gap="sm">
                  {acceptedFiles.map((file, index) => (
                    <Image
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        objectFit: "cover",
                        width: "90%",
                        height: "100%",
                        borderRadius: "0.5rem",
                      }}
                    />
                  ))}
                </Flex>
              )}
            </Group>
          </Dropzone>
        </Flex>

        {/* Right Pane: Questions and Answers */}
        <Flex direction="column" gap="sm" style={{ flex: 1, padding: "1rem 2rem", maxHeight: "100%", overflowY: "auto" }}>
          <ScrollArea h="77.5vh">
            {questionsAndAnswers.length > 0 ? (
              <ul style={{ paddingInlineStart: "0", listStyleType: "none", margin: "0", padding: "0" }}>
                {questionsAndAnswers.map((qa, index) => (
                  <li key={index} style={{ marginBottom: "1rem" }}>
                    <Text size="lg" weight={500} style={{ whiteSpace: "pre-line" }}>{qa.question}</Text>
                    <div style={{ whiteSpace: "pre-line", marginTop: "0.5rem" }}>
                      <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Answer:</span>
                      <span> </span>
                      <Highlight style={{ display: 'inline' }} highlight={qa.answer}>
                        {qa.answer}
                      </Highlight>
                    </div>
                    <div style={{ whiteSpace: "pre-line", marginTop: "0.5rem" }}>
                      <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Explanation:</span>
                      <span> </span>
                      <Text style={{ display: 'inline' }}>{qa.explanation}</Text>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Text size="lg" color="dimmed">Answers will appear here after click view answer.</Text>
            )}
          </ScrollArea>
        </Flex>
      </Flex>

      {/* Overlay Footer */}
      <Group style={{ position: "fixed", inset: "auto 40px 40px auto", bottom: "30px", right: "40px" }}>
        <Button variant="default" size="md" radius="xl" onClick={() => setAcceptedFiles([])}>Cancel</Button>
        <Button
          variant="filled"
          size="md"
          radius="xl"
          onClick={handleGenerateQuestions}
          disabled={loading}
        >
          {loading ? "Generating..." : "View Answers"}
        </Button>
      </Group>
    </>
  );
}
