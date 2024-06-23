'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, CardMedia, Grid, Box, TextField, InputAdornment, Button, ListItemIcon, IconButton,
  Menu, ListItemText, Popover,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState('');
  const sm = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);

  const dataload = () => {
    setDataLoad(true);
    fetch('http://localhost:4000/api/books')
      .then(response => response.json())
      .then(data => {
        console.log('datalog', data)
        setBooks(data);
        setDataLoad(false);
      })
      .catch(error => {
        setError(error.message)
        setDataLoad(false);
      });
  }
  useEffect(() => {
    dataload()
  }, []);


  const [selectedBook, setSelectedBook] = useState(null);

  const handleMenuOpen = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (event) => {
    setAnchorEl(event.currentTarget);
    setEdit(true)
    handleMenuClose();
  };

  const handleDelete = (book) => {
    setLoading(true)
    fetch('http://localhost:4000/api/deled/' + book.id)
      .then(response => response.json())
      .then(data => {
        console.log('datalog', data)
        setBooks(data);
        setLoading(false);
      })
      .catch(error => {
        setBooks(null);
        setError(error.message)
        setLoading(false);
      });
    handleMenuClose();
  };




  const handleSearch = () => {
    setLoading(true)
    fetch('http://localhost:4000/api/books/' + search)
      .then(response => response.json())
      .then(data => {
        console.log('datalog', data)
        setBooks(data);
        setLoading(false);
      })
      .catch(error => {
        setBooks(null);
        setError(error.message)
        setLoading(false);
      });
    setSearch('')
  }


  const handleSave = () => {
    setDataLoad(true);
    fetch('http://localhost:4000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedBook)
    })
      .then(response => response.json())
      .then(data => {
        console.log('datalog', data);
        setBooks(data);
        setDataLoad(false);
      })
      .catch(error => {
        setError(error.message);
        setDataLoad(false);
      });
    setAnchorEl(null);
    setEdit(false);
  };


  const handleCancel = () => {
    setEdit(false);
    setSelectedBook(null);
    setAnchorEl(null)
  };


  return (
    <>
      <Box>

      </Box>
      <Container maxWidth="lg" >
        <Box style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={(e) => {
              if (window) window.open('http://localhost:4000/api-docs/', '_blank');
            }}
            sx={{
              marginTop: sm ? '0px' : '10px',
              display: 'flex',
              height: '40px',
              justifyContent: 'center'
            }}
            startIcon={<SettingsIcon fontSize="small" />}
            color="primary"
            variant="outlined"
          >
            Swagger UI
          </Button>
        </Box>

        <Box sx={{ my: 3, marginTop: '20px' }}>
          <Card>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ maxWidth: 500, width: '100%' }}>
                <TextField
                  disabled={loading || books?.length < 2}
                  fullWidth
                  placeholder={'Search Book'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{

                    endAdornment: (
                      <InputAdornment position="end">

                        <Button
                          onClick={handleSearch}
                          startIcon={
                            (loading ? <CircularProgress size={24} /> : (books?.length > 1 ? <SearchIcon fontSize="small" /> : <RefreshIcon fontSize="small" />))
                          }
                          sx={{
                            background: 'white', display: 'flex',
                            justifyContent: 'center'
                          }}
                        >{
                            books?.length > 1 ? <>Search</> : <>Refresh</>
                          }

                        </Button>
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                />
              </Box>
              {
                <Button
                  onClick={(e) => {
                    setSelectedBook({
                      title: "",
                      author: "",
                      publishedDate: "",
                      summary: "",
                    })
                    handleUpdate(e)
                  }}
                  sx={{
                    marginLeft: '10px',
                    marginTop: sm ? '0px' : '10px',
                    display: 'flex',
                    height: '40px',
                    justifyContent: 'center'
                  }}
                  startIcon={(!sm && <AddCircleIcon fontSize="small" />)}
                  color="primary"
                  variant="contained"

                >
                  {
                    sm ? <>ADD</> : <>ADD BOOK</>
                  }
                </Button>
              }

            </CardContent>

          </Card>
        </Box>
        <Grid container spacing={4}>
          {books && books.length > 0 ? books.map((book, i) => (
            <Grid item xs={12} sm={books.length == 1 ? 12 : 6} md={books.length == 1 ? 12 : 4} key={book.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={'book.jpg'}
                  alt={book.title}
                  style={{ cursor: 'pointer' }} onClick={() => setBooks([book])}
                />
                <CardContent >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <IconButton
                      aria-label="more"
                      aria-controls={i}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, book)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={i}
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      elevation={1}
                    >
                      <MenuItem onClick={(e) => { handleUpdate(e); console.log('datalog', book); }}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(selectedBook)}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                    </Menu>
                  </Box>
                  <Box style={{ cursor: 'pointer' }} onClick={() => setBooks([book])}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {book.author}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Published: {book.publishedDate}
                    </Typography>
                    <Typography variant="body1">
                      {books.length == 1 ? book.summary : book.summary.slice(0, 40) + '...'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )) : <Box justifyContent={'center'} width={'100%'} marginTop={'20px'} display={'flex'} style={{ color: error ? 'red' : '' }}>
            {error ? <>{error}</> : <>DATA NOT FOUND</>}
          </Box>}
          <Grid item xs={12} justifyContent={'center'} display={'flex'}>
            {
              dataLoad && <CircularProgress />
            }
          </Grid>
        </Grid>

      </Container >
      <Popover
        anchorEl={selectedBook ? anchorEl : null}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'center'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'center',
        }}
        onClose={() => setEdit(false)}
        open={edit}
        PaperProps={{
          sx: { maxWidth: '600px', minHeight: '500px', padding: '10px', background: 'rgba(244, 246, 252, 1)' }
        }}
      >
        <Grid container spacing={2} marginY={1}>
          {selectedBook && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={selectedBook.title}
                    height="200"
                    image={'book.jpg'}
                  />
                  <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px' }}>
                    <div>
                      <Typography variant="h6" component="div">
                        {selectedBook.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedBook.author}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Published: {selectedBook.publishedDate}
                      </Typography>
                      <Typography variant="body1">
                        {selectedBook.summary.slice(0, 40) + '...'}
                      </Typography>
                    </div>
                    <div style={{ marginLeft: '5px', minWidth: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                      <Typography variant="h5" color="primary">
                        {selectedBook.currency} {selectedBook.amount}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              {/* Editable fields */}
              <Grid item xs={12}>
                <TextField
                  required
                  id="title"
                  name="title"
                  label="Title"
                  value={selectedBook.title}
                  onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="author"
                  name="author"
                  label="Author"
                  value={selectedBook.author}
                  onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Summary"
                  multiline
                  rows={4}
                  value={selectedBook.summary}
                  onChange={(e) => setSelectedBook({ ...selectedBook, summary: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleCancel} variant="contained" color="secondary" fullWidth>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
                  Save
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Popover>
    </>
  );
}


