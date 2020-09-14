import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import logger from "../shipment_form/node_modules/sabio-debug";

const _logger = logger.extend("FileUpload");
_logger("from FileUpload");

const FileUpload = (props) => {
  const onDrop = useCallback((acceptedFiles) => {
    props.form.setFieldValue(props.field.name, acceptedFiles);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const displayPreview =
    props.form.values[props.field.name] &&
    props.form.values[props.field.name].map((file) => {
      return (
        <div
          className={
            props.isPreviewDisplay
              ? props.imgWrapperClasses || "col-md-3"
              : "d-none"
          }
          key={file.path}
        >
          <img
            src={URL.createObjectURL(file)}
            className={props.imgClasses || "img-fluid mb-2"}
          />
        </div>
      );
    });

  return (
    <React.Fragment>
      <div {...getRootProps()}>
        <input {...getInputProps()} accept={props.accept} multiple={props.isMultiple}/>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      <aside>
        <div className="row">{displayPreview}</div>
      </aside>
    </React.Fragment>
  );
};

export default FileUpload;

FileUpload.propTypes = {
  imgWrapperClasses: PropTypes.string,
  imgClasses: PropTypes.string,
  isPreviewDisplay: PropTypes.bool,
  accept: PropTypes.string,
  isMultiple: PropTypes.bool,
  form: PropTypes.shape({
    values: PropTypes.shape({
    }),
    setFieldValue: PropTypes.func,
  }),
  field: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};