import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";

const Sellitem = () => {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({
    name: "",
    quantity: 0,
    price: 0,
  });
  const { items, addItem, setItems, host } = useWarehouseStore((state) => ({
    items: state.items,
    addItem: state.addItem,
    setItems: state.setItems,
    host: state.host,
  }));

  const handleClose = () => setShow(false);

  const handleSubmit = async () => {
    const { name, quantity, price } = item;
    console.log(item);
    fetch(`${host}/api/items/sellitem`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price }),
    }).then(async (res) => {
      const json = await res.json();
      if (!json.success) {
        return toast.error(json.error, {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setShow(false);
      toast.success("Sold Successfully", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };
  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container>
        <Button
          variant="primary"
          onClick={() => {
            setShow(true);
          }}
        >
          Sell Item
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sell Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Item Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="quantity">
                <Form.Label>Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price:</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={onChange}
                />
              </Form.Group>
            </Form>
            <p className="h4 tw-normal">
              Total Price:{" "}
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(item.price * item.quantity)}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Sellitem;
