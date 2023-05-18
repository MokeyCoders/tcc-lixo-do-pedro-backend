const mimetypes = [
  /image\/.+/, // imagens
  /text\/.+/, // qualquer texto
  /video\/.+/, // qualquer vídeo
  /audio\/.+/, // qualquer aúdio
  /application\/zip/,
  /application\/svg\+.+/, // possível imagem svg
  /application\/pdf/, // pdf
  /application\/xml/, // xml
  /application\/vnd\.ms-powerpoint/, // ppt
  /application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation/, // pptx
  /application\/vnd\.ms-excel/, // xls
  /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/, // xlsx
  /application\/msword/, // doc
  /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/, // docx
  /application\/vnd\.oasis\.opendocument\..+/, // openoffice novo
  /application\/vnd\.sun\.xml\..+/, // openoffice antigo
];

export default mimetypes;
