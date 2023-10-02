"use client";

import { useRef, useState, useEffect } from "react";
import {
  Box,
  Input,
  VStack,
  Button,
  UnorderedList,
  Container,
  Text,
  Spinner,
} from "@chakra-ui/react";
import PhotoItem from "@/components/PhotoItem";
import { Photo, Comment } from "@/types/photoTypes";
import {
  collection,
  query,
  getDocs,
  getDoc,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestoreDb, storageDb } from "@/lib/firebaseClientConfig";
import { useUserId } from "@/hooks/useUserId";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Home = () => {
  const userId = useUserId();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPhotosAndComments = async () => {
      if (!userId) return;

      try {
        const photosQuery = query(
          collection(firestoreDb, `users/${userId}/photos`),
          orderBy("timestamp", "desc")
        );
        const photosSnapshot = await getDocs(photosQuery);
        const photos: Photo[] = [];

        for (const photoDoc of photosSnapshot.docs) {
          const photoData = photoDoc.data() as Photo;
          const commentsQuery = query(
            collection(photoDoc.ref, "comments"),
            orderBy("timestamp", "desc")
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          const comments: Comment[] = commentsSnapshot.docs.map(
            (commentDoc) => {
              return { ...commentDoc.data(), id: commentDoc.id } as Comment;
            }
          );
          photos.push({ ...photoData, id: photoDoc.id, comments });
        }

        setPhotos(photos);
      } catch (error) {
        console.error("Error fetching photos: ", error);
      }
    };

    fetchPhotosAndComments();
    if (userId) setIsLoading(false);
  }, [userId]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUpload = () => {
    if (!selectedFile || !userId) return;

    const photoId = uuidv4();
    const storageRef = ref(storageDb, `users/${userId}/photos/${photoId}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading file: ", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            // create a document reference with a specific ID
            const photoRef = doc(
              firestoreDb,
              `users/${userId}/photos/${photoId}`
            );

            // set the document at the specific reference
            await setDoc(photoRef, {
              id: photoId,
              userId: userId,
              src: downloadURL,
              timestamp: serverTimestamp(),
            });

            const newPhotoSnap = await getDoc(photoRef);
            const createdPhoto = newPhotoSnap.data();

            if (createdPhoto) {
              const typedCreatedPhoto: Photo = {
                timestamp: createdPhoto.timestamp,
                comments: [],
                userId: createdPhoto.userId,
                src: createdPhoto.src,
                id: createdPhoto.id,
              };

              const newPhotoList: Photo[] = [typedCreatedPhoto, ...photos];
              setPhotos(newPhotoList);
            } else {
              console.error("Failed to retrieve uploaded photo data");
            }

            // Clear the file input after upload.
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setSelectedFile(undefined);
          } catch (error) {
            console.error("Error adding document: ", error);
          }
        });
      }
    );
  };

  const onAddComment = (idx: number, comment: any) => {
    const newPhotos = [...photos];
    newPhotos[idx].comments = [comment, ...newPhotos[idx].comments];
    setPhotos(newPhotos);
  };

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        left="0"
        backgroundColor="rgba(255, 255, 255, 0.9)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Container centerContent>
      User ID: {userId}
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
            accept=".jpg, .jpeg, .png, .gif, .webp, .heic"
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
