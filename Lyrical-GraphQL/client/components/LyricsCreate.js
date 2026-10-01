import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useMutation } from "@apollo/client/react";
import Box from "@mui/material/Box";
import { Button, Typography, TextField, CircularProgress } from "@mui/material";
import { gql } from "@apollo/client";
import { FETCH_SONG_QUERY } from "../queries/fetchSong"; // Import the song detail query

const AddLyricToSong = gql`
  mutation AddLyricToSong($lyrics: String, $songId: ID!) {
    addLyricToSong(content: $lyrics, songId: $songId) {
      id
      title
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

const LyricsCreate = () => {
  const { id: songId } = useParams();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    lyrics: "",
  });

  const [errors, setErrors] = useState({});

  const [addLyrics, { loading }] = useMutation(AddLyricToSong, {
    // Fix 2: Tell Apollo to refetch the song list query so the UI updates instantly
    update(cache, { data: { addLyricToSong } }) {
      try {
        // 1. Read the existing song query from the cache
        const existingData = cache.readQuery({
          query: FETCH_SONG_QUERY,
          variables: { id: songId },
        });

        if (existingData?.song) {
          // 2. Write the updated song data (including the new lyrics list) back to the cache
          cache.writeQuery({
            query: FETCH_SONG_QUERY,
            variables: { id: songId },
            data: {
              song: {
                ...existingData.song,
                lyrics: addLyricToSong.lyrics,
              },
            },
          });
        }
      } catch (err) {
        console.error("Error updating cache:", err);
      }
    },
    onCompleted: () => {
      showNotification("Lyrics added successfully!", "success");
      setFormData({ lyrics: "" });
    },
    onError: (err) => {
      showNotification("Mutation error occurred: " + err.message, "error");
      setErrors((prevErrors) => ({ ...prevErrors, global: err.message }));
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formData.lyrics.trim()) newErrors.lyrics = "Lyrics are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addLyrics({ variables: { songId: songId, lyrics: formData.lyrics } });
  };

  return (
    <Box sx={{ padding: 2, boxShadow: 3, bgcolor: "background.paper", borderRadius: 1, width: "80%" }} onSubmit={handleSubmit} component="form">
      <Typography variant="body1" component="p">
        Enter your lyric above and submit.
      </Typography>
      <TextField
        required
        name="lyrics"
        id="outlined-required"
        value={formData.lyrics}
        onChange={handleChange}
        error={!!errors.lyrics}
        helperText={errors.lyrics}
        disabled={loading}
        rows={4}
        multiline
        fullWidth
        placeholder="Song Lyrics"
        sx={{
          "& .MuiInputBase-input": {
            padding: "0px 20px", // Adjust inner padding safely
          },
          padding: "20px 0px", // Adjust outer padding safely
        }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1 }} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Save Lyrics"}
      </Button>
    </Box>
  );
};

export default LyricsCreate;
