import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import useSaleStore from "../store/saleStore";

const Purchaseitem = () => {
  const [show, setShow] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    price: "",
    party: "",
  });
  const { items, addItem, setItems, host } = useWarehouseStore((state) => ({
    items: state.items,
    addItem: state.addItem,
    setItems: state.setItems,
    host: state.host,
  }));
  const { setPurchases, purchases } = useSaleStore((state) => ({
    purchases: state.purchases,
    setPurchases: state.setPurchases,
  }));
  const handleClose = () => {
    setShow(false);
    setItem({
      name: "",
      quantity: "",
      price: "",
      party: "",
    });
  };

  const handleSubmit = async () => {
    const { name, quantity, price, party } = item;
    setIsSubmitDisabled(true);
    fetch(`${host}/api/items/purchaseitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price }),
    }).then(async (res) => {
      const json = await res.json();
      if (!json.success) {
        setIsSubmitDisabled(false);
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
      } else {
        const totalPrice = price * quantity;
        const newRes = await fetch(`${host}/api/sales/addpurchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            price: totalPrice,
            quantity,
            party,
          }),
        });
        const newJson = await newRes.json();
        if (!newJson.success) {
          setIsSubmitDisabled(false);
          return toast.error(newJson.error, {
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
          setIsSubmitDisabled(false);
          setShow(false);
          setItem({
            name: "",
            quantity: "",
            price: "",
            party: "",
          });
          const newPurchases = JSON.parse(JSON.stringify(purchases));
          newPurchases.push(newJson.savedPurchase);
          setPurchases(newPurchases);

          toast.success("Purchased Successfully", {
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
      }
    });
  };

  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Button
        className="pill-button rounded-5"
        variant="primary"
        onClick={() => {
          setShow(true);
        }}
      >
        <FontAwesomeIcon icon={faCirclePlus} size="lg" /> Add Purchase
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="party">
              <Form.Label>Party Name:</Form.Label>
              <Form.Control
                type="text"
                name="party"
                value={item.party}
                onChange={onChange}
              />
            </Form.Group>
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
                min={1}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={item.price}
                onChange={onChange}
                min={1}
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
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              (item.price <= 0 || item.quantity <= 0) && isSubmitDisabled
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Purchaseitem;
