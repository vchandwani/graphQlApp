import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField, CircularProgress } from "@mui/material";

// Fix 1: Import useMutation directly from @apollo/client
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNotification } from "../context/NotificationContext";

// Import your query if you have it exported, or define a reference to refetch
import { FETCH_SONGS } from "./SongList"; // (Assuming you export your query from SongList)

const AddSong = gql`
  mutation AddSong($title: String) {
    addSong(title: $title) {
      id
      title
    }
  }
`;

export default function SongCreate() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: "",
  });

  const [errors, setErrors] = useState({});

  const [addSong, { loading }] = useMutation(AddSong, {
    // Fix 2: Tell Apollo to refetch the song list query so the UI updates instantly
    refetchQueries: [{ query: FETCH_SONGS }],
    onCompleted: () => {
      showNotification("Song created successfully!", "success");
      setFormData({ title: "" });
      navigate("/");
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
    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addSong({ variables: { title: formData.title } });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 450,
        margin: "auto",
        mt: 4,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="bold">
        Create New Song
      </Typography>

      {/* Fix 3: Removed defaultValue and updated label to "Song Title" */}
      <TextField
        required
        name="title"
        id="outlined-required"
        label="Song Title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        disabled={loading}
        sx={{
          "& .MuiInputBase-input": {
            padding: "0px 20px", // Adjust inner padding safely
          },
        }}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1 }} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Save Song"}
      </Button>
    </Box>
  );
}
