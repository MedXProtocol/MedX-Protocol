import React from 'react';

const TextInputGroup = ({
                          className,
                          inputClassName,
                          labelClassName,
                          name,
                          label,
                          required,
                          onChange
                        }) => (
  <div className={className}>
    <fieldset>
      <div className="form-group">
        <label className={labelClassName || 'control-label col-xs-4'}>{label}
          {required && <star>*</star>}
        </label>
        <div className={inputClassName || 'col-xs-8'}>
          <input
            type="text"
            className="form-control"
            name={name}
            required={required}
            onChange={onChange}/>
        </div>
      </div>
    </fieldset>
  </div>
);

export default TextInputGroup;