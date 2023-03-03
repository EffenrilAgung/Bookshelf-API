const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(10);

  const insertAt = new Date().toISOString();
  const updatedAt = insertAt;

  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  console.log('finished', finished);

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(404);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(404);
    return response;
  }

  const storedBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertAt,
    updatedAt,
  };
  books.push(storedBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: books[0].id,
      },
    });
    response.code(200);
    return response;
  }
  response.code(500);
  return response;
};

const getAllBookHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

const getBookById = (request, h) => {
  const { id } = request.params;

  console.log(id);
  const book = books.filter((x) => {
    if (x.id == id) {
      console.log(x.filter((c) => c.id === id)[0]);
    }
  });

  console.log(book);

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler, getAllBookHandler, getBookById };
