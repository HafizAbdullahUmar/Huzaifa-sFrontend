import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import useSaleStore from "../store/saleStore";

const ReturnSale = ({ sale }) => {
  const [show, setShow] = useState(false);
  const { host } = useSaleStore((state) => ({
    host: state.host,
  }));

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReturn = async () => {
    const { name, quantity, price, party, status } = sale;
    fetch(`${host}/api/items/returnitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price, party }),
    }).then(async (res) => {
      let response = await fetch(`${host}/api/sales/updatesale/${sale._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          quantity,
          price,
          party,
          status,
        }),
      });
      let json = await response.json();
      if (!json.success) {
        toast.error(json.error, {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.success("Returned Successfully", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setShow(false);
      }
    });
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Return
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Return Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to return the sale?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleReturn}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReturnSale;
