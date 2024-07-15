import React, { useState, useEffect } from "react";
import { Flex, Text, rem, Input, Table, Modal, Button, ActionIcon, Pagination, Group } from "@mantine/core";
import { IconUpload, IconFileText, IconX, IconCheck, IconSearch, IconEye, IconMessage, IconTrash } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from '@mantine/notifications';
import { uploadDocument } from "../../api/uploaddocument";
import { getAllDocuments } from "../../api/getalldocuments";
import { deleteDocument } from "../../api/deletedocument";
import { askDocument } from "../../api/askdocument";

export default function Search(props) {
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false); // State to manage uploading status
    const [question, setQuestion] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [answer, setAnswer] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false); // State to manage search status

    useEffect(() => {
        fetchDocuments();
    }, []); // Fetch documents on component mount

    const fetchDocuments = async () => {
        try {
            const data = await getAllDocuments();
            setDocuments(data.data); // Assuming API response structure is { data: [...] }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const handleDrop = async (files) => {
        try {
            setUploading(true); // Start uploading state

            // Upload document via API
            await uploadDocument(files[0]);

            // Show success notification after upload is complete
            notifications.show({
                title: 'Success',
                message: 'File uploaded successfully!',
                icon: <IconCheck size={18} />,
                color: 'teal',
                autoClose: 3000,
            });

            // Reset Dropzone after a short delay
            setTimeout(() => {
                setAcceptedFiles([]);
            }, 3000);

            // Fetch updated list of documents after upload
            fetchDocuments();
        } catch (error) {
            console.error("Error uploading file:", error);
            notifications.show({
                title: 'Error',
                message: 'Failed to upload file.',
                icon: <IconX size={18} />,
                color: 'red',
                autoClose: 3000,
            });
        } finally {
            setUploading(false); // End uploading state
        }
    };

    const handleReject = () => {
        setAcceptedFiles([]);
        console.log("rejected files");
    };

    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            // After successful deletion, update the documents list
            fetchDocuments();
            notifications.show({
                title: 'Success',
                message: 'Document deleted successfully!',
                icon: <IconCheck size={18} />,
                color: 'teal',
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error deleting document:", error);
            notifications.show({
                title: 'Error',
                message: 'Failed to delete document.',
                icon: <IconX size={18} />,
                color: 'red',
                autoClose: 3000,
            });
        }
    };

    const handleAsk = async () => {
        if (currentDocument && question) {
            try {
                setSearching(true); // Start searching state
                const response = await askDocument(currentDocument.document_id, question);
                console.log("Response from askDocument:", response); // Log the response for debugging

                if (response && response.data && response.data.answers) {
                    setAnswer(response.data.answers);
                } else {
                    setAnswer('No answer received.');
                }
                setModalOpen(true);

            } catch (error) {
                console.error("Error asking document:", error);
                notifications.show({
                    title: 'Error',
                    message: 'Failed to get answer from document.',
                    icon: <IconX size={18} />,
                    color: 'red',
                    autoClose: 3000,
                });
            } finally {
                setSearching(false); // End searching state
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setQuestion(''); // Reset question state
        setAnswer(''); // Reset answer state
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let filteredDocuments = searchTerm ? documents.filter(document =>
        document.document_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : documents;
    const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Table Rows for Current Page
    const rows = currentItems.map((document) => (
        <Table.Tr key={document.document_id}>
            <Table.Td>{document.document_name}</Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle" color="blue" aria-label="View File">
                    <a href={document.document_url} target="_blank" rel="noopener noreferrer">
                        <IconEye />
                    </a>
                </ActionIcon>
            </Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle" aria-label="Search Document">
                    <IconMessage onClick={() => { setCurrentDocument(document); setModalOpen(true); }} />
                </ActionIcon>
            </Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle" color="red" aria-label="Delete Document">
                    <IconTrash onClick={() => handleDelete(document.document_id)} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Flex direction="column" gap="md">
            <Flex justify="flex-start" style={{ width: '100%' }}>
                <Dropzone
                    onDrop={handleDrop}
                    onReject={handleReject}
                    maxSize={5 * 1024 ** 2}
                    accept={[
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ]}
                    {...props}
                    style={{ width: '96%' }}
                >
                    <Group
                        justify="center"
                        gap="xl"
                        mih={300}
                        style={{ pointerEvents: "none", textAlign: "center" }}
                    >
                        {uploading ? (
                            <Text size="xl" inline>
                                Uploading file...
                            </Text>
                        ) : (
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
                                        <IconFileText
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-dimmed)",
                                            }}
                                            stroke={1.5}
                                        />
                                        <div>
                                            <Text size="xl" inline>
                                                Drag file PDF or DOCX here or click to select files.
                                            </Text>
                                        </div>
                                    </Flex>
                                </Dropzone.Idle>
                            </>
                        )}
                    </Group>
                </Dropzone>
            </Flex>
            <Flex gap="md" flex={1} justify="flex-start">
                <Input
                    placeholder="Search document"
                    leftSection={
                        <IconSearch size="1rem" />
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '15%' }}
                />
            </Flex>
            <Flex gap="md" flex={1} justify="flex-start" style={{ width: '96%' }}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>File name</Table.Th>
                            <Table.Th>View file</Table.Th>
                            <Table.Th>Search Document</Table.Th>
                            <Table.Th>Delete</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Flex>

            <Modal opened={modalOpen} onClose={handleCloseModal} title="Ask Document">
                <Flex direction="column" gap="md">
                    <Input
                        placeholder="Type your question here"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Button onClick={handleAsk} disabled={searching}>
                        {searching ? 'Searching...' : 'Search Document'}
                    </Button>
                    {answer && (
                        <Text>
                            <strong>Answer:</strong> {answer}
                        </Text>
                    )}
                </Flex>
            </Modal>

            {/* Pagination Component */}
            <Flex justify="center" style={{ marginTop: '1rem' }}>
                <Pagination
                    total={Math.ceil(filteredDocuments.length / itemsPerPage)}
                    value={currentPage}
                    onChange={paginate}
                    color="gray"
                />
            </Flex>
        </Flex>
    );
}
