import moment from "moment";
import React, { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ReturnSale from "./ReturnSale";
import useSaleStore from "../store/saleStore";
import { toast } from "react-toastify";

const TransactionItem = (props) => {
  const { type, color, sOrP } = props;
  const { name, price, quantity, date, party, status } = sOrP;
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({
    ename: "",
    equantity: "",
    eprice: "",
    eparty: "",
  });
  const { setPurchases, setSales, purchases, sales, host } = useSaleStore(
    (state) => ({
      purchases: state.purchases,
      sales: state.sales,
      host: state.host,
      setPurchases: state.setPurchases,
      setSales: state.setSales,
    })
  );
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
    const { ename, equantity, eprice, eparty } = item;
    if (type === "S") {
      let response = await fetch(`${host}/api/sales/updatesale/${sOrP._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: ename,
          quantity: equantity,
          price: eprice,
          party: eparty,
        }),
      });
      const json = await response.json();
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
      }
      // Logic to edit in Client
      const tempSales = JSON.parse(JSON.stringify(sales));
      for (let i = 0; i < tempSales.length; i++) {
        if (tempSales[i]._id === sOrP._id) {
          tempSales[i].name = ename;
          tempSales[i].quantity = equantity;
          tempSales[i].price = eprice;
          tempSales[i].party = eparty;
        }
      }
      setSales(tempSales);
      setShow(false);
    } else if (type === "P") {
      let response = await fetch(
        `${host}/api/sales/updatepurchase/${sOrP._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: ename,
            quantity: equantity,
            price: eprice,
            party: eparty,
          }),
        }
      );
      const json = await response.json();
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
      }
      // Logic to edit in Client
      const tempPurchases = JSON.parse(JSON.stringify(purchases));
      for (let i = 0; i < tempPurchases.length; i++) {
        if (tempPurchases[i]._id === sOrP._id) {
          tempPurchases[i].name = ename;
          tempPurchases[i].quantity = equantity;
          tempPurchases[i].price = eprice;
          tempPurchases[i].party = eparty;
        }
      }
      setPurchases(tempPurchases);
      setShow(false);
    }
  };

  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container
        className="trans-item d-flex justify-content-center align-items-center py-2"
        style={{ backgroundColor: color }}
        onDoubleClick={() => {
          setShow(true);
          setItem({
            ename: name,
            equantity: quantity,
            eprice: price,
            eparty: party,
          });
        }}
      >
        <Row className="trans-row">
          <Col md={2}>
            <p className="item-date">
              <span className="fw-bold">
                {moment(date).format("MMM Do YYYY")}
              </span>
            </p>
          </Col>
          <Col md={2}>
            <p className="item-type fw-bold">{party}</p>
          </Col>
          <Col md={3}>
            <p className="item-name">
              {" "}
              <span className="fw-bold">{name}</span>
            </p>
          </Col>
          <Col md={2}>
            <p className="item-price">
              <span className="fw-bold">{price}</span>
            </p>
          </Col>
          <Col md={type === "S" ? 1 : 2}>
            <p className="item-quantity">
              <span className="fw-bold">{quantity}</span>
            </p>
          </Col>
          {type === "S" ? (
            <Col md={2}>
              <p className="item-status">
                <span className="fw-bold">{status}</span>
              </p>
            </Col>
          ) : null}
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === "S" ? "Edit Sale" : "Edit Purchase"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="eparty">
              <Form.Label>Party Name:</Form.Label>
              <Form.Control
                type="text"
                name="eparty"
                value={item.eparty}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ename">
              <Form.Label>Item Name:</Form.Label>
              <Form.Control
                type="text"
                name="ename"
                value={item.ename}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="equantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                name="equantity"
                value={item.equantity}
                onChange={onChange}
                min={1}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eprice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                name="eprice"
                value={item.eprice}
                onChange={onChange}
                min={1}
              />
            </Form.Group>
          </Form>
          <p className="h4 tw-normal">
            Total Price:{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(item.eprice * item.equantity)}
          </p>
          <ReturnSale sale={sOrP} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              item.eprice <= 0 ||
              item.equantity <= 0 ||
              item.ename === "" ||
              item.eparty === ""
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionItem;
