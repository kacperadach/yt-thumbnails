const { renderStillOnLambda } = require("@remotion/lambda/client");

const args = process.argv.slice(2);

process.env.REMOTION_AWS_ACCESS_KEY_ID = args[0];
process.env.REMOTION_AWS_SECRET_ACCESS_KEY = args[1];

async function main() {
  const { url } = await renderStillOnLambda({
    region: "us-east-1",
    functionName: "remotion-render-4-0-81-mem2048mb-disk2048mb-120sec",
    serveUrl:
      "https://remotionlambda-useast1-znpird87xb.s3.us-east-1.amazonaws.com/sites/thumbnail/index.html",
    composition: "ThumbnailComposition",
    inputProps: {
      thumbnail: JSON.parse(args[2]),
    },
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
    envVariables: {},
    downloadBehavior: { type: "download", fileName: `thumbnail.jpeg` },
  });

  console.log(url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
