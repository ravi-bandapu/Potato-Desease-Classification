import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import image from "./bg.png";

// Custom styled button
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ffffff"),
  backgroundColor: "#ffffff",
  "&:hover": {
    backgroundColor: "#ffffff7a",
  },
}));

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = 0;

  const sendFile = useCallback(async () => {
    if (!selectedFile) return;

    let formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/predict";
      let res = await axios.post(apiUrl, formData);

      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const clearData = () => {
    setData(null);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsLoading(true);
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <>
      <AppBar position="static" sx={{ background: "#be6a77", boxShadow: "none", color: "white" }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Bandapu Ravi : Potato Disease Classification
          </Typography>
          <Avatar src="/logo.png" sx={{ marginLeft: "auto" }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} disableGutters sx={{ backgroundImage: `url(${image})`, height: "93vh", backgroundSize: "cover", marginTop: "8px" }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: "4em 1em 0 1em" }}>
          <Grid item xs={12}>
            <Card sx={{ maxWidth: 400, height: 500, margin: "auto", backgroundColor: "transparent", boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%)", borderRadius: "15px" }}>
              {preview ? (
                <CardActionArea>
                  <CardMedia sx={{ height: 400 }} image={preview} component="img" title="Uploaded Image" />
                </CardActionArea>
              ) : (
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-file"
                    type="file"
                    onChange={onSelectFile}
                  />
                  <label htmlFor="upload-file">
                    <Button variant="contained" color="primary" component="span">
                      Upload Image
                    </Button>
                  </label>
                </CardContent>
              )}

              {data && (
                <CardContent sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: "14px", fontWeight: "bolder", color: "#000000a6" }}>Label:</TableCell>
                          <TableCell align="right" sx={{ fontSize: "14px", fontWeight: "bolder", color: "#000000a6" }}>Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontSize: "22px", fontWeight: "bolder", color: "#000000a6" }}>{data.class}</TableCell>
                          <TableCell align="right" sx={{ fontSize: "22px", fontWeight: "bolder", color: "#000000a6" }}>{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CircularProgress sx={{ color: "#be6a77" }} />
                  <Typography variant="h6">Processing</Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && (
            <Grid item sx={{ maxWidth: "416px", width: "100%" }}>
              <ColorButton variant="contained" sx={{ width: "100%", borderRadius: "15px", padding: "15px 22px", fontSize: "20px", fontWeight: 900, color: "#000000a6" }} onClick={clearData} startIcon={<ClearIcon fontSize="large" />}>
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};
