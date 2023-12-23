// import { v4 as uuidv4 } from "uuid";
// import { useState } from "react";
// import { BsPlus, BsTrash } from "react-icons/bs";
// import {
//   creatingAsset,
//   thumbnail,
//   isCreatingAsset,
// } from "../../../lib/signals";
// import { Container, Row, Col } from "react-bootstrap";
// import AssetRow from "./AssetRow";
// import { signal } from "@preact/signals-react";
// import { MdOutlineTextFields } from "react-icons/md";
// import { BsCardImage } from "react-icons/bs";
// import { FaShapes } from "react-icons/fa";
// import { capitalizeFirstLetter } from "../../../lib/utils";
// import EditField from "../EditField";
// import { Arrow, Circle, Image, Text } from "../../../lib/types";
// import {
//   DEFAULT_TEXT_OBJECT,
//   DEFAULT_IMAGE_OBJECT,
//   DEFAULT_CIRCLE_OBJECT,
// } from "../../../lib/constants";
// import EditMenu from "../EditMenu";
// import EditMenuContainer from "../EditMenuContainer";

export default function CreateAsset() {
  return null;
  // const onUpdate = (newFields: Object) => {
  //   if (!creatingAsset.value) {
  //     return;
  //   }

  //   creatingAsset.value = {
  //     ...creatingAsset.value,
  //     ...newFields,
  //   };
  // };

  // if (!creatingAsset.value) {
  //   return null;
  // }
  // return (
  //   <Container>
  //     <EditMenuContainer
  //       thumbnailAsset={creatingAsset.value}
  //       onUpdate={onUpdate}
  //     />
  //     <Row className="my-4">
  //       <Col className="flex justify-center items-center">
  //         <button
  //           className="flex bg-green-200 rounded justify-center items-center p-2 font-bold"
  //           onClick={() => {
  //             if (!creatingAsset.value || !thumbnail.value) {
  //               return;
  //             }

  //             thumbnail.value.assets.push({
  //               ...creatingAsset.value,
  //             });
  //             creatingAsset.value = null;
  //             isCreatingAsset.value = false;
  //           }}
  //         >
  //           <span>Add</span>
  //           <BsPlus size="2rem" />
  //         </button>
  //       </Col>
  //       <Col className="flex justify-center items-center">
  //         <button
  //           className="flex bg-red-400 rounded justify-center items-center p-2 font-bold"
  //           onClick={() => {
  //             creatingAsset.value = null;
  //             isCreatingAsset.value = false;
  //           }}
  //         >
  //           <span>Delete</span>
  //           <BsTrash size="2rem" />
  //         </button>
  //       </Col>
  //     </Row>
  //   </Container>
  // );
}
