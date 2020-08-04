import React, { useState, useRef, useEffect } from "react";
import { render } from "react-dom";
import * as html2canvas from "html2canvas";

import { Stage, Layer, Image, Group } from "react-konva";
import ImageComp from "../image";

import Portal from "../../utils/portals";
import {bringCanvasOnTop} from "../../utils"

import styles from "./PDFContainer.module.css";

const PDFContainer = ({ images, children, index, selected, setCurrentPage }) => {
  const [imgData, setImgData] = useState([]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [selectedImgId, selectImg] = useState(null);

  const docRef = useRef();

  useEffect(() => {
    const width = docRef.current.clientWidth;
    const height = docRef.current.clientHeight;
    console.log("dimensions", width, height);
    setDimensions((prevState) => {
      return {
        ...prevState,
        width,
        height,
      };
    });
  }, []);

  useEffect(() => {
    bringCanvasOnTop(index)
  }, [bringCanvasOnTop])

  useEffect(() => {
    let imageBuffers = [];
    if(images){
      images.forEach((img, index) => {
        imageBuffers.push({
          x: 150 + index * 10,
          y: 150 + index * 10,
          width: 100,
          height: 100,
          id: index,
          url: img.src.base64,
        });
      });
    }
    

    setImgData(imageBuffers);
  }, [images]);

  const updateImageResize = (newAttrs, index) => {
    const imgs = imgData.slice();
    imgs[index] = newAttrs;
    setImgData(imgs);
  };

  const handleSelectImg = (id) => {
    if(selectedImgId === id) {
      selectImg("")
    }else {
      selectImg(id)
    }
  }

  return (
    <div className={`${styles.wrapper} ${selected? styles.selected: ''} docs`}  id="doc" ref={docRef} onClick={() => setCurrentPage(index+1)}>
      <div id="print" className={`${styles.print} prints`} >
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer style={{position: 'absolute', top: 0, left: 0, zIndex: 100}}>
          {
            children? 
            <Portal index={index}>
              {children}
          </Portal>: null
          }
          
          {imgData.map((img, i) => (
            <ImageComp
              key={i}
              url={img.url}
              imgProps={img}
              onSelect={() => {
                handleSelectImg(img.id);
              }}
              isSelected={img.id === selectedImgId}
              onChange={(newAtrr) => updateImageResize(newAtrr, i)}
            />
          ))}
        </Layer>
      </Stage>
      </div>
    </div>
  );
};

export default PDFContainer;
