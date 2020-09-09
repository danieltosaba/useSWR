import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { AddComment } from "./AddComment";
import useSWR, { mutate, trigger } from "swr";
import axios from "axios";

export function Home({ comments }: any) {
  const { data } = useSWR("/comments", { initialData: comments });
  return (
    <React.Fragment>
      <Box marginBottom={2}>
        <AddComment />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.comment}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.comment}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={async () => {
                      mutate(
                        "/comments",
                        data.filter((d) => d.id !== row.id),
                        false
                      );
                      await axios.delete(`/comments/${row.id}`);
                      trigger("/comments");
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

Home.getInitialProps = async (ctx) => {
  const { data } = await axios("/comments");
  return { comments: data }
}