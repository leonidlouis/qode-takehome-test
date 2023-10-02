"use client";
import React, { useMemo, useState } from "react";
import {
  Box,
  Image,
  FormControl,
  Textarea,
  Button,
  UnorderedList,
  ListItem,
  Text,
  Divider,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Photo } from "@/types/photoTypes";
import { useUserId } from "@/hooks/useUserId";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firebaseClientConfig";

interface PhotoItemProps {
  photo: Photo;
  onAddComment: (comment: any) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onAddComment }) => {
  const userId = useUserId();
  const [tempComment, setTempComment] = useState<string>("");

  const handleAddComment = async () => {
    if (!tempComment || !userId || !photo.id) return;

    const commentsRef = collection(
      firestoreDb,
      `users/${userId}/photos/${photo.id}/comments`
    );

    const newComment = {
      text: tempComment,
      timestamp: serverTimestamp(),
    };

    try {
      const newCommentRef = await addDoc(commentsRef, newComment);
      const newCommentSnap = await getDoc(newCommentRef);
      const createdComment = newCommentSnap.data();

      onAddComment({ id: newCommentRef.id, ...createdComment });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }

    setTempComment("");
  };

  const photoTimestamp = useMemo(() => {
    // Convert Firestore Timestamp to milliseconds
    const dateInMillis =
      photo.timestamp.seconds * 1000 + photo.timestamp.seconds / 1000000;
    const formattedDate = dayjs(dateInMillis).format("MMMM D, YYYY h:mm A");

    return formattedDate;
  }, [photo]);

  return (
    <ListItem mb={6}>
      <Box boxShadow="base" borderRadius="md" overflow="hidden">
        <Image src={photo.src} />
        <Text fontSize="xs" pl={4} pt={4}>
          {dayjs(photoTimestamp).format("MMMM D, YYYY h:mm A")}
        </Text>
        <FormControl p={4}>
          <Textarea
            placeholder="Add a comment"
            value={tempComment}
            onChange={(e) => setTempComment(e.target.value)}
            size="sm"
            mb={2}
          />
          <Button size="sm" onClick={handleAddComment}>
            Add Comment
          </Button>
        </FormControl>
        <Box bg="gray.100" p={2}>
          <UnorderedList listStyleType="none" pl={0}>
            {photo.comments.map((comment, index) => (
              <>
                {index > 0 && <Divider border="0.5px solid lightgray" />}
                <ListItem key={index} mb={1} fontSize="sm">
                  <Box display="flex" alignItems="center" width="100%">
                    <Box
                      flex="1"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="normal"
                    >
                      {comment.text}
                    </Box>
                    <Text color="gray.500" marginLeft="auto">
                      ({dayjs(comment.timestamp.toDate()).fromNow()})
                    </Text>
                  </Box>
                </ListItem>
              </>
            ))}
          </UnorderedList>
        </Box>
      </Box>
    </ListItem>
  );
};

export default PhotoItem;
