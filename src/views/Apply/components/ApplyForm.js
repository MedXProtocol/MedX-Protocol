import React from 'react';
import { Link } from 'react-router-dom';

import FileInputGroup from './FileInputGroup';
import TextInputGroup from './TextInputGroup';

const ApplyForm = ({
                     form,
                     isTestMode,
                     isSubmitDisabled,
                     onSubmit,
                     onFileInputChange,
                     onTextInputChange,
                   }) => (
  <form onSubmit={onSubmit} className="form-horizontal">

    <div className="card-content">

      <div className="row">
        <div className="col-lg-12 col-md-12 top15">
          {form.physicianName && <h3>Welcome, {form.physicianName}</h3>}
        </div>
      </div>

      <hr/>

      <div className="row">
        <FileInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medSchoolDiploma"
          label="Medical School Diploma:"
          fileName={form.medSchoolDiplomaDocFileName}
          required
          onChange={onFileInputChange}/>
        <FileInputGroup
          className="col-lg-6 col-md-6 top15"
          name="residencyDiploma"
          label="Residency Diploma:"
          fileName={form.residencyDiplomaDocFileName}
          required
          onChange={onFileInputChange}/>
      </div>

      <div className="row">
        <FileInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medLicense"
          label="Medical License:"
          fileName={form.medLicenseDocFileName}
          required
          onChange={onFileInputChange}/>
        <FileInputGroup
          className="col-lg-6 col-md-6 top15"
          name="specialtyCertificate"
          label="Specialty Certificate:"
          fileName={form.specialtyCertificateDocFileName}
          required
          onChange={onFileInputChange}/>
      </div>

      <hr/>

      {isTestMode &&
      <div className="row">
        <TextInputGroup
          className="col-lg-12 col-md-12 top15"
          inputClassName="col-xs-10"
          labelClassName="control-label col-xs-2"
          name="physicianName"
          label="Physician Name:"
          required
          onChange={onTextInputChange}/>
      </div>
      }
      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medSchoolName"
          label="Name of Medical School:"
          required
          onChange={onTextInputChange}/>
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="specialty"
          label="Specialty:"
          required
          onChange={onTextInputChange}/>
      </div>
      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medLicenseLocation"
          label="License Location:"
          required
          onChange={onTextInputChange}/>
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="specialtyCertificteLocation"
          label="Specialty Location:"
          required
          onChange={onTextInputChange}/>
      </div>
      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medLicenseExpirationDate"
          label="Expiration Date:"
          required
          onChange={onTextInputChange}/>
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="officePhone"
          label="Office Phone:"
          required
          onChange={onTextInputChange}/>
      </div>
      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="medLicenseNumber"
          label="License #:"
          required
          onChange={onTextInputChange}/>
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="officeAddress"
          label="Office Address:"
          required
          onChange={onTextInputChange}/>
      </div>
      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="prescribesNumber"
          label="Prescriber #:"
          required
          onChange={onTextInputChange}/>
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="languagesSpoken"
          label="Languages Spoken:"
          required
          onChange={onTextInputChange}/>
      </div>


      <div className="row">
        <TextInputGroup
          className="col-lg-6 col-md-6 top15"
          name="residencyProgram"
          label="Residency Program:"
          required
          onChange={onTextInputChange}/>
      </div>

      <hr/>

      <div className="row">
        <div className="col-lg-12 col-md-12 top15">
          <fieldset>
            <div className="form-group">
              <label className="control-label col-xs-2">Additional information about your practice:</label>
              <div className="col-xs-10">
                <textarea rows="5"
                          className="form-control"
                          name="additionalInformation"
                          onChange={onTextInputChange}/>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

    </div>
    <div className="card-footer text-right">
      <div className="category" style={{ marginRight: 5, marginBottom: 10 }}>Required fields <star>*</star></div>
      <Link to="/" className="btn btn-fill btn-danger">Cancel</Link>
      &nbsp;
      <button disabled={isSubmitDisabled} type="submit" className="btn btn-fill btn-primary">Submit Application</button>
    </div>
  </form>
);

export default ApplyForm;