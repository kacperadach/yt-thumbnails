import { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { fetchImages, uploadImage } from "../lib/api";
import { images, isPollingImages } from "../lib/signals";
import { ImageResource } from "../lib/types";
import { useSignalEffect } from "@preact/signals-react";
import { BsX } from "react-icons/bs";

interface UploadedImageGalleryProps {
  handleSelect: (image: ImageResource) => void;
}

export default function UploadedImageGallery(props: UploadedImageGalleryProps) {
  const { handleSelect } = props;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<ArrayBuffer | string | null>(
    null
  );

  const fetchImagesAndPoll = async () => {
    const response = await fetchImages();
    if (!response.success) {
      isPollingImages.value = false;
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

    const processingImageIds = images.value
      .filter((i: ImageResource) => i.status === "pending")
      .map((i: ImageResource) => i.id);

    if (processingImageIds.length === 0) {
      isPollingImages.value = false;
      return;
    }

    setTimeout(() => fetchImagesAndPoll(), 3000);
  };

  useEffect(() => {
    if (!isPollingImages.value) {
      isPollingImages.value = true;
      fetchImagesAndPoll();
    }
  }, []);

  const handleImageProcess = async () => {
    if (!selectedFile) {
      return;
    }
    const response = await uploadImage(selectedFile);
    if (response.success) {
      images.value = [...images.value, response.data];
    }
    setSelectedFile(null);
    setPreviewUrl(null);

    if (!isPollingImages.value) {
      isPollingImages.value = true;
      fetchImagesAndPoll();
    }
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
      <Row className="border-t-2 mt-4">
        <Col>
          <div className="p-4">
            <h4>
              Upload an image to automatically make the background transparent!
            </h4>
          </div>
        </Col>
      </Row>
      <Row className="flex my-1 items-center">
        <Col>
          <input
            type="file"
            className="border-2 border-gray-200 rounded-md p-1 w-full text-sm cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <img src={previewUrl as string} alt="Preview" className="w-full" />
          )}
        </Col>
        <Col md={2}>
          <button
            className="p-2 border bg-green-200 rounded font-bold"
            onClick={handleImageProcess}
          >
            Process
          </button>
        </Col>
      </Row>

      {images.value.length > 0 && (
        <>
          <Row>
            <Col>
              <h4>All Images</h4>
            </Col>
          </Row>
          <Row>
            {images.value
              .slice() // Creates a shallow copy of the array
              .sort((a, b) => {
                const timestampA = new Date(a.created_at).getTime();
                const timestampB = new Date(b.created_at).getTime();
                return timestampB - timestampA;
              })
              .map((image: ImageResource, index: number) => {
                const processing = image.status === "pending";

                return (
                  <Col md={4} key={index}>
                    <div
                      style={{ minHeight: "5rem" }}
                      className={`p-2 w-full h-full flex items-center justify-center relative rounded hover:bg-gray-200 ${
                        !processing && "cursor-pointer"
                      }`}
                      onClick={() => {
                        handleSelect(image);
                      }}
                    >
                      {image.url && <img src={image.url} />}
                      {processing && (
                        <div className="absolute">
                          <Spinner color="black" />
                        </div>
                      )}
                      {image.status === "failed" && (
                        <div className="flex flex-column justify-center items-center">
                          <BsX color="red" size="4rem" />
                          <span>Failed to Process</span>
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })}
          </Row>
        </>
      )}
    </>
  );
}
