const MIN_IMG_SIZE = 300;

const base64Img = (file: File) =>
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

const reduceImageSize = async (
  base64Str: string,
  MAX_WIDTH = 450,
  MAX_HEIGHT = 450
) => {
  let resized_base64 = await new Promise<string>((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
  return resized_base64;
};

const calcImageSize = (image: string) => {
  let y = 1;
  if (image.endsWith("==")) {
    y = 2;
  }
  const x_size = image.length * (3 / 4) - y;
  return Math.round(x_size / 1024);
};

export const getBase64 = async (files: File[]) => {
  return Promise.all(
    files.map(async (file) => {
      const base64 = await base64Img(file);
      const size = calcImageSize(base64);
      if (size > MIN_IMG_SIZE) {
        const resizedBase64 = await reduceImageSize(base64);
        return resizedBase64;
      } else {
        return base64;
      }
    })
  );
};
