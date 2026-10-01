import React from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Spinner from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotification } from "../context/NotificationContext";
import ResponsiveDialog from "./Dialog";

export const FETCH_SONGS = gql`
  query FetchSongs {
    songs {
      id
      title
    }
  }
`;

export const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id) {
      id
      title
    }
  }
`;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SongList = () => {
  const { showNotification } = useNotification();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [songToDelete, setSongToDelete] = React.useState(null);

  const { loading, error, data } = useQuery(FETCH_SONGS);
  const [deleteSong, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: FETCH_SONGS }],
    onError: (err) => {
      showNotification(`Error deleting song: ${err.message}`, "error");
    },
    onCompleted: () => {
      showNotification("Song deleted successfully!", "success");
      setShowConfirmation(false);
      setSongToDelete(null);
    },
  });

  const handleDelete = (id) => {
    setShowConfirmation(true);
    setSongToDelete(id);
  };

  if (loading || deleteLoading)
    return (
      <Spinner size="30px" aria-label="Loading…">
        Loading songs...
      </Spinner>
    );
  if (error || deleteError) return <Typography sx={{ p: 2, color: "error.main" }}>Error: {error?.message || deleteError?.message}</Typography>;

  const selectedSongTitle = data?.songs?.find((song) => song.id === songToDelete)?.title || "";

  return (
    <Box sx={{ padding: 2, boxShadow: 3, bgcolor: "background.paper", borderRadius: 1 }}>
      <ResponsiveDialog
        open={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setSongToDelete(null);
        }}
        title="Delete Song"
        content={`Are you sure you want to delete the song "${selectedSongTitle}"?`}
        proceedAction={() => {
          deleteSong({ variables: { id: songToDelete } });
        }}
      />

      <Grid container direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Grid item>
          <Typography variant="h4" component="h2" gutterBottom>
            Song List
          </Typography>
        </Grid>
        <Grid item>
          <Link to="/song/new">
            <AddCircleOutlinedIcon />
          </Link>
        </Grid>
      </Grid>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.songs?.map((song) => (
              <StyledTableRow key={song.id} className="song-row">
                <TableCell>
                  <Link to={`/song/${song.id}`}>{song.title}</Link>
                </TableCell>
                <TableCell sx={{ justifyContent: "flex-end", display: "flex", gap: 1 }}>
                  <DeleteIcon sx={{ color: "error.main", cursor: "pointer" }} onClick={() => handleDelete(song.id)} />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SongList;
