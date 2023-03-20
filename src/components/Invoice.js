import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const Invoice = ({ item }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Details
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sale Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-holder">
            <p className="text">
              Party: <span className="value">{item.party}</span>
            </p>
          </div>
          {item.name ? (
            <>
              <div className="text-holder">
                <p className="text">
                  Item: <span className="value">{item.name}</span>
                </p>
              </div>
              <div className="text-holder">
                <p className="text">
                  Quantity: <span className="value">{item.quantity}</span>
                </p>
              </div>
            </>
          ) : (
            ""
          )}

          <div className="text-holder">
            <p className="text">
              Total Amount: <span className="value">{item.total}</span>
            </p>
          </div>
          <div className="text-holder">
            <p className="text">
              Recieved: <span className="value">{item.balance}</span>
            </p>
          </div>
          <div className="text-holder">
            <p className="text">
              Balance Due:{" "}
              <span className="value">{item.total - item.balance}</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Invoice;
