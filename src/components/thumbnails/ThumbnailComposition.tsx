import { useState, useEffect } from "react";
import { Thumbnail as RemotionThumbnail } from "@remotion/player";
import { AbsoluteFill, Img, staticFile } from "remotion";
import styles from "./styles.module.css";
import { generateFullLongShadow } from "../../lib/textShadow";
import { Video } from "remotion";
import { Image, Shape, Text, Thumbnail } from "../../lib/types";
import TextAsset from "./Text";
import { getPixelScaleFactor } from "../../lib/utils";
import ShapeComponent from "./Shape";
import ImageComponent from "./Image";
import BaseAsset from "./BaseAsset";
import { EDITOR_WIDTH } from "../../lib/constants";

const FPS = 30;

interface ThumbnailCompositionProps {
  thumbnail: Thumbnail;
}

function ThumbnailComposition(props: Record<string, unknown>) {
  const { thumbnail, width, editable, selectedAssetId } = props;

  const { background, assets } = thumbnail as Thumbnail;

  const pixelScaleFactor = getPixelScaleFactor(width as number);

  const [videoSrc, setVideoSrc] = useState(background.videoSrc || "");

  useEffect(() => {
    setVideoSrc(background.videoSrc || "");
  }, [background]);

  return (
    <AbsoluteFill className="relative overflow-visible border">
      {background.type === "video" && videoSrc && (
        <div className="absolute w-full h-full">
          <RemotionThumbnail
            component={() => (
              <Video
                src={videoSrc}
                width={width as number}
                height={(width as number) * (9 / 16)}
                onError={(e) =>
                  setVideoSrc(background.videoSrc + "?time=" + Date.now())
                }
              />
            )}
            compositionWidth={width as number}
            compositionHeight={(width as number) * (9 / 16)}
            frameToDisplay={FPS * (background.videoTime || 0)}
            durationInFrames={1000000}
            fps={FPS}
          />
        </div>
      )}

      {background.type === "image" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('${background.imageSrc}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {/* {background.src && (
            <img
              src={background.src || ""}
              className="w-full h-full object-contain"
            />
          )} */}
        </div>
      )}

      {background.type === "color" && (
        <div
          className="absolute w-full h-full"
          style={{
            backgroundColor: background.color,
          }}
        />
      )}

      <>
        {assets.map((asset, index) => {
          return (
            <BaseAsset
              key={index}
              asset={asset}
              editable={!!editable}
              pixelScaleFactor={pixelScaleFactor}
            />
          );
        })}
      </>
    </AbsoluteFill>
  );
}

interface ThumbnailPreviewProps {
  thumbnail: Thumbnail;
  editable?: boolean;
  width?: number;
  height?: number;
  selectedAssetId?: string;
}

export default function ThumbnailPreview(props: ThumbnailPreviewProps) {
  const { thumbnail, width, height, editable, selectedAssetId } = props;

  return (
    <RemotionThumbnail
      component={ThumbnailComposition}
      inputProps={{ thumbnail, width, editable, selectedAssetId }}
      compositionWidth={width || 1280}
      compositionHeight={height || 720}
      frameToDisplay={0}
      durationInFrames={0}
      fps={0}
    />
  );
}

// export default function ThumbnailComposition() {
//   return (
//     <AbsoluteFill>
//       <div className={styles.imageContainer} style={{ left: "30%" }}>
//         <Img
//           src={staticFile("/images/tan.png")}
//           style={{ objectFit: "cover" }}
//         />
//       </div>
//       <div className={styles.imageContainer} style={{ left: "30%" }}>
//         <Img src={staticFile("/images/yes.png")} />
//       </div>
//       <div
//         className={styles.imageContainer}
//         style={{ left: "60%", top: "40%", width: "20%" }}
//       >
//         <Img src={staticFile("/images/encyclopedia.jpg")} />
//         <div
//           style={{
//             position: "absolute",
//             zIndex: 9,
//             fontSize: "2rem",
//             color: "yellow",
//             background: "blue",
//             top: "40%",
//             fontFamily: "Impact",
//             width: "60%",
//           }}
//         >
//           <span>League of Legends</span>
//         </div>
//       </div>
//       <div className={styles.videoContainer}>
//         <Thumbnail
//           component={() => (
//             <Video
//               src={staticFile("/videos/tan_quadra.mp4")}
//               width={1920}
//               height={1080}
//             />
//           )}
//           compositionWidth={1920}
//           compositionHeight={1080}
//           frameToDisplay={140000}
//           durationInFrames={1000000}
//           fps={30}
//         />
//         {/* <div>
//           <Img src={staticFile("/images/tom-money.png")} />
//         </div> */}
//       </div>
//       <div
//         className={styles.thumbnailPrimaryTextBackground}
//         style={{
//           textShadow: `${generateFullLongShadow(7, "black")}`,
//           left: "10%",
//           bottom: "0%",
//           top: "auto",
//           height: "fit-content",
//         }}
//       >
//         <span className={styles.thumbnailPrimaryText}>Is he scripting?</span>
//       </div>
// <div
//   className={styles.thumbnailSecondaryTextBackground}
//   style={{
//     textShadow: `${generateFullLongShadow(4, "black")}`,
//   }}
// >
//   <span className={styles.thumbnailSecondaryText}>She said YES!!!</span>
// </div>
//       <div className={styles.circle}></div>
//       <div className={styles.arrow}>
//         <div className={styles.tail}></div>
//         <div className={styles.head}></div>
//       </div>
//     </AbsoluteFill>
//   );
// return (
//   <AbsoluteFill>
//     <div className={styles.imageContainer}>
//       <Img src={staticFile("/images/clickbait.png")} />
//     </div>
//     <div className={styles.videoContainer}>
//       <Thumbnail
//         component={() => (
//           <Video
//             src={staticFile("/videos/gameplay.mp4")}
//             width={1920}
//             height={1080}
//           />
//         )}
//         compositionWidth={1920}
//         compositionHeight={1080}
//         frameToDisplay={629710}
//         durationInFrames={1000000}
//         fps={30}
//       />
//     </div>
//     <div
//       className={styles.thumbnailPrimaryTextBackground}
//       style={{
//         textShadow: `${generateFullLongShadow(7, "black")}`,
//       }}
//     >
//       <span className={styles.thumbnailPrimaryText}>New Kill Record?</span>
//     </div>
//     <div
//       className={styles.thumbnailSecondaryTextBackground}
//       style={{
//         textShadow: `${generateFullLongShadow(4, "black")}`,
//       }}
//     >
//       <span className={styles.thumbnailSecondaryText}>Amazing Play!!!</span>
//     </div>
//     <div className={styles.circle}></div>
//     <div className={styles.arrow}>
//       <div className={styles.tail}></div>
//       <div className={styles.head}></div>
//     </div>
//   </AbsoluteFill>
// );
// }
