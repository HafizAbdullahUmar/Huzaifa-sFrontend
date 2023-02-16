import React, { useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import useSaleStore from "../store/saleStore";

const Sellitem = () => {
  const [show, setShow] = useState(false);
  const submitRef = useRef(null);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    price: "",
    party: "",
  });
  const { host, sales, setSales } = useSaleStore((state) => ({
    host: state.host,
    sales: state.sales,
    setSales: state.setSales,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, price, party } = item;
    fetch(`${host}/api/items/sellitem`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price, party }),
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
      } else {
        const totalPrice = price * quantity;
        const newRes = await fetch(`${host}/api/sales/addsale`, {
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
          setShow(false);
          setItem({
            name: "",
            quantity: "",
            price: "",
            party: "",
          });
          const newSales = JSON.parse(JSON.stringify(sales));
          newSales.push(newJson.savedSale);
          setSales(newSales);
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
        className="mx-3 pill-button rounded-5"
        variant="danger"
        onClick={() => {
          setShow(true);
        }}
      >
        <FontAwesomeIcon icon={faCirclePlus} size="lg" /> Add Sale
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="party">
              <Form.Label>Party Name:</Form.Label>
              <Form.Control
                type="text"
                name="party"
                value={item.party}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Item Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={item.name}
                required
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={item.quantity}
                required
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="price"
                required
                value={item.price}
                onChange={onChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="d-none"
              type="submit"
              ref={submitRef}
            >
              Submit
            </Button>
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
            onClick={() => {
              submitRef.current.click();
            }}
            disabled={item.price <= 0 || item.quantity.price <= 0}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sellitem;
