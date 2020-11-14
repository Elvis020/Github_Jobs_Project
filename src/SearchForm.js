import React from "react";
import { Form, Col } from "react-bootstrap";



export default function SearchForm({ params, handleParamChange }){
    // console.log(onParamsChange);
  return (
    <Form className="mb-4">
      <Form.Row className="align-items-end">
        <Form.Group as={Col}>
          <Form.Label>Description</Form.Label>
          <Form.Control onChange={handleParamChange} value={params.description} name="description" type="text" />
        </Form.Group>
        {/* <Form.Group as={Col}>
          <Form.Label>Location</Form.Label>
          <Form.Control onChange={onParamsChange} value={params.location} name="Location" type="text" />
        </Form.Group>
        <Form.Group as={Col} xs="auto" className="ml-2">
            <Form.Check onChange={onParamsChange} value={params.full_time} type="checkbox" className="mb-2" name="full-time" id="full-time" label="Only Full Time" />
        </Form.Group> */}
      </Form.Row>
    </Form>
  );
};

