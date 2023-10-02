"use client";

import { useRef, useState } from "react";
import {
  Box,
  Input,
  VStack,
  Button,
  UnorderedList,
  Container,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import PhotoItem from "@/components/PhotoItem";
import { Photo } from "@/types/photoTypes";

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      setPhotos([
        {
          src: reader.result as string,
          comments: [],
          timestamp: dayjs().toISOString(),
        },
        ...photos,
      ]); // sorted by newest -> oldest photo
      setSelectedFile(undefined);
    };

    // Clear the file input after upload.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onAddComment = (index: number, comment: string) => {
    if (!comment) return;
    const newPhotos = [...photos];
    newPhotos[index].comments = [
      {
        text: comment,
        timestamp: dayjs().toISOString(), // add the timestamp when a comment is added.
      },
      ...newPhotos[index].comments, // sorted by newest -> oldest comment
    ];
    setPhotos(newPhotos);
  };

  return (
    <Container centerContent>
      <VStack spacing={5} w="full" maxW="md">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          borderWidth="1px"
          borderRadius="md"
        >
          <label htmlFor="file-upload">
            <Button as="span">Choose File</Button>
          </label>
          <Text marginLeft={2}>
            {selectedFile ? selectedFile.name : "No file chosen"}
          </Text>
          <Input
            type="file"
            onChange={onFileChange}
            ref={fileInputRef}
            display="none"
            id="file-upload"
          />
        </Box>
        <Button onClick={onUpload} disabled={!selectedFile}>
          Upload
        </Button>
        <Box w="full">
          <UnorderedList listStyleType="none">
            {photos.map((photo, idx) => (
              <PhotoItem
                key={idx}
                photo={photo}
                onAddComment={(comment) => onAddComment(idx, comment)}
              />
            ))}
          </UnorderedList>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home;
