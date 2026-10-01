import React from "react";
import LyricsCreate from "./LyricsCreate";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Link, useParams } from "react-router-dom";
import { FETCH_SONG_QUERY } from "../queries/fetchSong";
import { useQuery } from "@apollo/client/react";
import LyricsList from "./LyricsList";

const SongDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(FETCH_SONG_QUERY, {
    variables: { id },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const song = data?.song;

  return (
    <Box sx={{ padding: 2, boxShadow: 3, bgcolor: "background.paper", borderRadius: 1 }}>
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Song Detail
        </Typography>
        <Grid item>
          <Link to={"/"}>Back to Songs</Link>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="p">
          Song Title: {song?.title}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "left", justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 1, paddingBottom: 1 }}>
        <Typography variant="body1" component="p">
          Lyrics
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "left", justifyContent: "flex-start", alignItems: "flex-start", paddingTop: 1, paddingBottom: 1 }}>
        <LyricsList lyrics={song?.lyrics} />
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid container direction="column" sx={{ justifyContent: "space-between", alignItems: "center" }} item xs={12}>
        <LyricsCreate songId={id} />
      </Grid>
    </Box>
  );
};

export default SongDetail;
