import React from 'react';
import { FormControl } from "react-bootstrap";

const DropdownInputGroup = ({
                            className,
                            inputClassName,
                            labelClassName,
                            name,
                            label,
                            options,
                            required,
                            onChange
                        }) => (
    <div className={className}>
        <fieldset>
            <div className="form-group">
                <label className={labelClassName || 'control-label col-xs-4'}>
                    {label}{required && <star>*</star>}
                </label>
                <div className={inputClassName || 'col-xs-8'}>
                    <FormControl componentClass="select" name={name} onChange={onChange} required={required}>
                        <option />
                        {options.map((option, index) => (
                            <option id={index} value={option}>{option}</option>
                        ))}
                    </FormControl>
                </div>
            </div>
        </fieldset>
    </div>
);

export default DropdownInputGroup;