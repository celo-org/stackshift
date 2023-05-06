import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableRowType } from "@/type";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1e2535",
    border: "1px solid #1e2535",
    color: theme.palette.common.white,
    fontSize: 15,
    fontFamily: "Pathway Extreme",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "Pathway Extreme",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#3f4d66",
  border: "1px solid #3f4d66",

  "&:nth-of-type(odd)": {
    backgroundColor: "#283449",
    border: "1px solid #283449",
  },

  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableComponent({ rows }: { rows: TableRowType[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Created</StyledTableCell>
            <StyledTableCell>User</StyledTableCell>
            <StyledTableCell align="center">Wager</StyledTableCell>
            <StyledTableCell align="center">Payout</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Tx</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.user}>
              <StyledTableCell
                sx={{ color: "#fff" }}
                component="th"
                scope="row"
                align="left"
              >
                {row.timestamp.toDateString() +
                  " " +
                  row.timestamp.toLocaleTimeString()}
              </StyledTableCell>
              <StyledTableCell
                sx={{ color: "#fff" }}
                component="th"
                scope="row"
              >
                {row.user}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                {row.wager}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                {row.payout}
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{
                  color: row.status ? "#00ff00" : "#ff0000",
                }}
              >
                {row.status ? "WON" : "LOST"}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="right">
                <a
                  target="_blank"
                  href={row.txUrl}
                  style={{
                    color: "#fff",
                  }}
                >
                  View Transaction
                </a>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
