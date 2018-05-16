import React from 'react';

const FileInputGroup = ({
                          className,
                          name,
                          label,
                          required,
                          fileName,
                          onChange
                        }) => (
  <div className={className}>
    <fieldset>
      <div className="form-group">
        <label className="control-label col-xs-4">{label}
          {required && <star>*</star>}
        </label>
        <div className="col-xs-8">
          <label className="btn btn-primary" style={{ width: '100%' }}>
            Browse...
            <input
              type="file"
              className="form-control"
              style={{ display: 'none' }}
              name={name}
              required={required}
              onChange={onChange}/>
          </label>
          <span>{fileName}</span>
        </div>
      </div>
    </fieldset>
  </div>
);

export default FileInputGroup;