import React, { useRef, useState, useEffect } from "react";
import Files from "react-butterfiles";
import * as jsPDF from "jspdf";
import * as html2canvas from "html2canvas";
import { pdfjs, Document, Page } from "react-pdf";

import PDFContainer from "./components/pdf-container";
import Controls from "./components/controls";

import styles from "./App.module.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function App() {
  const [imageUploads, setImageUploads] = useState({});

  const [pdfUpload, setPdfUpload] = useState({
    files: [],
    errors: [],
  });

  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentPage == null) {
      generatePDF()
    }
  }, [currentPage]);

  const generatePDF = () => {
    const docs = document.querySelectorAll(".docs");
    const pdf = new jsPDF("p", "px", "a4");

    docs.forEach((doc, index) => {
      window.devicePixelRatio = 2;
      html2canvas(doc, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, 0, width, height);
        if (index + 1 === docs.length) {
          pdf.save("test.pdf");
        }
      });
    });
  };

  const imageUpload = (
    <Files
      multiple={true}
      maxSize="2mb"
      multipleMaxSize="10mb"
      multipleMaxCount={10}
      accept={["image/jpg", "image/jpeg"]}
      onSuccess={(files) => {
        console.log("the files", files);
        setImageUploads((prevState) => {
          return {
            ...prevState,
            [currentPage + "Images"]: prevState[currentPage + "Images"]
              ? [...prevState[currentPage + "Images"], ...files]
              : files,
          };
        });
      }}
      onError={(errors) =>
        setImageUploads((prevState) => {
          return {
            ...prevState,
            errors,
          };
        })
      }
      convertToBase64={true}
    >
      {({ browseFiles }) => (
        <>
          <button className={styles.control__button} onClick={browseFiles}>
            Select Image
          </button>
        </>
      )}
    </Files>
  );

  const fileUpload = (
    <Files
      multiple={true}
      maxSize="100mb"
      multipleMaxSize="100mb"
      multipleMaxCount={1}
      accept={["application/pdf"]}
      onSuccess={(files) => {
        console.log("the files", files);
        setPdfUpload((prevState) => {
          return {
            ...prevState,
            files: [...prevState.files, ...files],
          };
        });
      }}
      onError={(errors) =>
        setPdfUpload((prevState) => {
          return {
            ...prevState,
            errors,
          };
        })
      }
      convertToBase64={true}
    >
      {({ browseFiles }) => (
        <>
          <button className={styles.control__button} onClick={browseFiles}>
            Upload PDF
          </button>
        </>
      )}
    </Files>
  );

  const generateButton = (
    <button
      className={`${styles.control__button} ${styles.generate__pdf}`}
      onClick={() => setCurrentPage(null)}
    >
      Generate PDF
    </button>
  );

  function onDocumentLoadSuccess({ numPages }) {
    console.log("number of pages", numPages);
    setNumPages(numPages);
  }

  const file = pdfUpload.files.length ? pdfUpload.files[0].src.base64 : "";

  const onSetCurrentPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.wrapper}>
      <Controls items={[generateButton, imageUpload, fileUpload]} />
      <div id="documents">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => {
            return (
              <PDFContainer
                key={index}
                images={imageUploads[index + 1 + "Images"]}
                index={index}
                selected={currentPage === index + 1}
                setCurrentPage={onSetCurrentPage}
              >
                <Document file={file}>
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                </Document>
              </PDFContainer>
            );
          })}
        </Document>
      </div>
    </div>
  );
}

export default App;
