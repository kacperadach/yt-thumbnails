import { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { fetchAIImages, fetchImages, uploadImage } from "../../../lib/api";
import { aiImages, images } from "../../../lib/signals";
import { AIImageResource, ImageResource } from "../../../lib/types";
import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import SelectableImage from "./SelectableImage";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadedImageGalleryProps {
  handleSelect: (
    image: ImageResource | AIImageResource,
    imageType: "upload" | "ai"
  ) => void;
  onBackClick?: () => void;
}

export default function UploadedImageGallery(props: UploadedImageGalleryProps) {
  const { handleSelect, onBackClick } = props;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<ArrayBuffer | string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [imageFilter, setImageFilter] = useState<"upload" | "ai">("upload");
  const [showUploadImage, setShowUploadImage] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      const response = await fetchImages();
      if (!response.success) {
        return;
      }

      images.value = [
        ...images.value.map((i: ImageResource) => {
          const updatedImage = response.data.find(
            (i2: ImageResource) => i2.id === i.id
          );
          if (updatedImage) {
            return updatedImage;
          }
          return i;
        }),
        ...response.data.filter((i: ImageResource) => {
          return !images.value.find((i2) => i2.id === i.id);
        }),
      ];
    };

    const getAIImages = async () => {
      const response = await fetchAIImages();
      if (!response.success) {
        return;
      }

      aiImages.value = [
        ...aiImages.value.map((i: AIImageResource) => {
          const updatedImage = response.data.find(
            (i2: AIImageResource) => i2.id === i.id
          );
          if (updatedImage) {
            return updatedImage;
          }
          return i;
        }),
        ...response.data.filter((i: AIImageResource) => {
          return !aiImages.value.find((i2) => i2.id === i.id);
        }),
      ];
    };

    getImages();
    getAIImages();
  }, []);

  const handleImageUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    const response = await uploadImage(selectedFile);
    if (response.success) {
      images.value = [...images.value, response.data];
      handleSelect(response.data, "upload");
    }
    setIsUploading(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowUploadImage(false);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Row className="mt-2 pt-2">
        <Col>
          <IconButton
            onClick={() => {
              if (showUploadImage) {
                setShowUploadImage(false);
              } else if (onBackClick) {
                onBackClick();
              }
            }}
          >
            <IoMdArrowRoundBack />
          </IconButton>
        </Col>
      </Row>
      {showUploadImage && (
        <>
          <Row>
            <Col>
              <div className="p-2">
                <h4 className="m-0">
                  Upload an image to automatically make the background
                  transparent!
                </h4>
              </div>
            </Col>
          </Row>
          <Row className="flex pt-2 my-1 items-center border-t-2">
            <Flex justify="between" align="center">
              <input
                type="file"
                className="border-2 border-gray-200 rounded-md p-1 w-full text-sm cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
              />

              {selectedFile && (
                <Button ml="1" className="px-2" onClick={handleImageUpload}>
                  {isUploading ? (
                    <Spinner style={{ width: "1rem", height: "1rem" }} />
                  ) : (
                    <Text weight="bold">Upload</Text>
                  )}
                </Button>
              )}
            </Flex>
            <Flex my="4">
              {previewUrl && (
                <img
                  src={previewUrl as string}
                  alt="Preview"
                  className="w-full"
                  style={{ maxHeight: "20rem", objectFit: "contain" }}
                />
              )}
            </Flex>
          </Row>
        </>
      )}

      {!showUploadImage && (
        <>
          <Row className="py-2">
            <Col>
              <h4 className="m-0">Image Library</h4>
            </Col>
          </Row>
          <Row className="py-2 border-t-2">
            <Flex justify="between">
              <Flex>
                <Button
                  mx="1"
                  variant={imageFilter === "upload" ? "solid" : "outline"}
                  onClick={() => setImageFilter("upload")}
                >
                  Uploaded
                </Button>
                <Button
                  mx="1"
                  variant={imageFilter === "ai" ? "solid" : "outline"}
                  onClick={() => setImageFilter("ai")}
                >
                  AI Generated
                </Button>
              </Flex>
              <Button mx="1" onClick={() => setShowUploadImage(true)}>
                <Text>Upload New Image</Text>
                <IoCloudUploadOutline />
              </Button>
            </Flex>
          </Row>
          <Row>
            {imageFilter === "upload" &&
              images.value
                .slice() // Creates a shallow copy of the array
                .sort((a, b) => {
                  const timestampA = new Date(a.created_at).getTime();
                  const timestampB = new Date(b.created_at).getTime();
                  return timestampB - timestampA;
                })
                .map((image: ImageResource) => {
                  return (
                    <Col md={4} key={image.id}>
                      <SelectableImage
                        image={image}
                        handleSelect={() => handleSelect(image, "upload")}
                        height="8rem"
                      />
                    </Col>
                  );
                })}
            {aiImages.value
              .slice() // Creates a shallow copy of the array
              .sort((a, b) => {
                const timestampA = new Date(a.created_at).getTime();
                const timestampB = new Date(b.created_at).getTime();
                return timestampB - timestampA;
              })
              .map((image: AIImageResource) => {
                return (
                  <Col md={4} key={image.id}>
                    <SelectableImage
                      image={image}
                      handleSelect={() => handleSelect(image, "ai")}
                      height="8rem"
                    />
                  </Col>
                );
              })}
          </Row>
        </>
      )}
    </>
  );
}
