import React, { useState } from "react";
import useWarehouseStore from "../store/warehouseStore";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const AddItem = () => {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({
    name: "",
    quantity: 0,
    price: 0,
  });
  const { items, addItem, setItems, host } = useWarehouseStore((state) => ({
    addItem: state.addItem,
    items: state.items,
    host: state.host,
    setItems: state.setItems,
  }));

  const handleClose = () => {
    setShow(false);
    setItem({
      name: "",
      quantity: 0,
      price: 0,
    });
  };

  const handleSubmit = async () => {
    setShow(false);
    const { name, quantity, price } = item;
    fetch(`${host}/api/items/additem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, quantity, price }),
    })
      .then(async (res) => {
        const tempItem = await res.json();
        if (tempItem.error) {
          toast.error(tempItem.error, {
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
          setItems(items.concat(tempItem));
          toast.success("Item Added", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setItem({
            name: "",
            quantity: "",
            price: "",
          });
        }
      })
      .catch((err) => {});
  };

  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Button
        variant="primary"
        className="btn-xl mx-3"
        onClick={() => {
          setShow(true);
        }}
      >
        Add Item
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Item Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="e.g Dell Mouse"
                value={item.name}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                placeholder="e.g 200"
                value={item.quantity}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="price"
                name="price"
                placeholder="e.g 150"
                value={item.price}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddItem;
