// import compress_images from "compress-images";
var compress_images = require("compress-images");

const input = "uncompressed/img/**/*.{jpg,JPG,jpeg,JPEG,gif,png,svg}";
const output = "public/img/";

compress_images(
  input,
  output,
  { compress_force: false, statistic: true, autoupdate: true },
  false,
  { jpg: { engine: "mozjpeg", command: ["-quality", "55"] } },
  { png: { engine: "pngquant", command: ["--quality=20-50"] } },
  { svg: { engine: "svgo", command: "--multipass" } },
  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function(error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");
  },
);
