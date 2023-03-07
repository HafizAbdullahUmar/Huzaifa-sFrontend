import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import useSaleStore from "../store/saleStore";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Sellitem = () => {
  const [show, setShow] = useState(false);
  const [recieved, setRecieved] = useState("");
  const submitRef = useRef(null);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    price: "",
    party: "",
  });

  const { itemNames, getItemNames, store } = useWarehouseStore((state) => ({
    itemNames: state.itemNames,
    store: state.store,
    getItemNames: state.getItemNames,
  }));
  const { host, sales, setSales } = useSaleStore((state) => ({
    host: state.host,
    sales: state.sales,
    setSales: state.setSales,
  }));

  useEffect(() => {
    getItemNames(store);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getItemNames(store);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const handleClose = () => {
    setShow(false);
    setRecieved("");
    setItem({
      name: "",
      quantity: "",
      price: "",
      party: "",
    });
  };
  const getBalance = () => {
    const { price, quantity, party } = item;
    const left = quantity * price - recieved;

    fetch(`${host}/api/parties/updateparty`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: party, dues: left }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!json.success) {
          console.log(json);
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
          console.log("its tro tho");
        }
      })
      .catch((err) => {
        console.log("hi");
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    getBalance();
    const { name, quantity, price, party } = item;
    console.log(item);
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
            store,
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
          <Modal.Title>Sells Item</Modal.Title>
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
              <Autocomplete
                onChange={(event, value) => {
                  const e = {
                    target: {
                      value: value,
                      name: "name",
                    },
                  };
                  onChange(e);
                }}
                name="name"
                disablePortal
                id="combo-box-demo"
                options={itemNames}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
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
            <p className="h5 tw-normal">
              Total Price:{" "}
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(item.price * item.quantity)}
            </p>
            <Form.Group className="mb-3" controlId="recieved">
              <Form.Label>Recieved:</Form.Label>
              <Form.Control
                type="number"
                name="recieved"
                required
                value={recieved}
                onChange={(e) => {
                  setRecieved(e.target.value);
                }}
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
