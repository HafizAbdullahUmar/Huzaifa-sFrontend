import React, { useEffect, useState } from "react";
import useWarehouseStore from "../store/warehouseStore";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const EditItem = () => {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const { setItems, items, host, editModale, setEditModale, editItem } =
    useWarehouseStore((state) => ({
      setItems: state.setItems,
      items: state.items,
      setEditModale: state.setEditModale,
      editItem: state.editItem,
      host: state.host,
      editModale: state.editModale,
    }));

  useEffect(() => {
    const { name, quantity, price } = editItem;
    if (editModale === true) {
      setItem({
        name: name,
        quantity: quantity,
        price: price,
      });
    }
    // eslint-disable-next-line
  }, [editModale]);

  const handleClose = () => {
    setEditModale(false);
    setShow(false);
    setItem({
      name: "",
      quantity: "",
      price: "",
    });
  };

  const handleSubmit = async () => {
    setShow(false);
    setEditModale(false);
    const { name, quantity, price } = item;
    fetch(`${host}/api/items/updateitem/${editItem._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price }),
    }).then(() => {
      toast.success("Edited Successfully", {
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
    // Logic to edit in Client
    const tempItems = JSON.parse(JSON.stringify(items));
    for (let i = 0; i < items.length; i++) {
      if (tempItems[i]._id === editItem._id) {
        tempItems[i].name = name;
        tempItems[i].quantity = quantity;
        tempItems[i].price = price;
      }
    }
    setItems(tempItems);
  };

  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Modal show={show || editModale} onHide={handleClose}>
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

export default EditItem;
