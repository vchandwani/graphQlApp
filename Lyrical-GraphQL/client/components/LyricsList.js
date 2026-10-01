import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNotification } from "../context/NotificationContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const mutation = gql`
  mutation LikeLyrics($id: ID!) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

const LyricsList = ({ lyrics }) => {
  const [likeLyric] = useMutation(mutation);
  const { setNotification } = useNotification();

  const onLike = (id) => {
    likeLyric({
      variables: { id },
    })
      .then((response) => {
        console.log("Liked lyric:", response.data.likeLyric);
      })
      .catch((error) => {
        console.error("Error liking lyric:", error);
        setNotification({ message: "Error liking lyric", type: "error" });
      });
  };

  return (
    <Grid item container xs={12}>
      {lyrics?.map((lyric) => (
        <Box
          key={lyric.id}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: 1,
            border: "1px solid #000123",
            borderRadius: 1,
            padding: 1,
            marginBottom: 1,
          }}
        >
          <Grid item xs={10}>
            {lyric.content}
          </Grid>
          <Grid item xs={2} direction="column" display="flex" alignItems="center" justifyContent="flex-end">
            <Grid item>
              {lyric.likes > 0 ? (
                <ThumbUpIcon sx={{ cursor: "pointer", color: "green" }} fontSize="small" onClick={() => onLike(lyric.id)} />
              ) : (
                <ThumbUpOutlinedIcon sx={{ cursor: "pointer" }} fontSize="small" onClick={() => onLike(lyric.id)} />
              )}
            </Grid>
            <Grid item sx={{ marginTop: 0.5, justifyContent: "center", display: "flex", alignItems: "center" }}>
              <Typography variant="body2">{lyric.likes}</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default LyricsList;
