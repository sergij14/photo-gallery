export const base64Img = (file: File) =>
  new Promise<string>(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        return resolve(reader.result);
      } else {
        return reject();
      }
    };
    reader.onerror = (error) => reject(error);
  });

export const getBase64 = async (files: File[]) => {
  return Promise.all(files.map((file) => base64Img(file)));
};
