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

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
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
    insertedAt,
    updatedAt,
  };
  books.push(storedBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  response.code(500);
  return response;
};

// const getAllBookHandler = (request, h) => {
//   const response = h.response({
//     status: 'success',
//     data: {
//       books: books.map((book) => ({
//         id: book.id,
//         name: book.name,
//         publisher: book.publisher,
//       })),
//     },
//   });

//   response.code(200);
//   return response;
// };
const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let findBook = books;

  const numberTrue = '1';
  const numberFalse = '0';

  console.log(finished === numberTrue);
  if (name !== undefined) {
    findBook = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }
  if (reading === numberTrue) {
    findBook = books.filter((book) => book.reading === true);
  }
  if (reading === numberFalse) {
    findBook = books.filter((book) => book.reading === false);
  }
  if (finished === numberTrue) {
    findBook = books.filter((book) => book.finished === true);
  }
  if (finished === numberFalse) {
    findBook = books.filter((book) => book.finished === false);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: findBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

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
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

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

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const indexBook = books.findIndex((book) => book.id === bookId);
  // const indexReading = books.findIndex((read) => read.reading == true);
  // console.log('reading', indexReading);
  if (indexBook !== -1) {
    books[indexBook] = {
      ...books[indexBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const indexBook = books.findIndex((book) => book.id === bookId);
  const bookFinished = books.findIndex((finish) => finish.finished == true);

  // console.log('indexBook = ', indexBook);
  // console.log('bookFinish = ', bookFinished);

  if (indexBook !== -1) {
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  } else if (bookFinished !== -1) {
    books.splice(indexBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookById,
  deleteBookByIdHandler,
};
