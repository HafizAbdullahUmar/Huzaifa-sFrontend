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
  const [change, setChange] = useState(0);
  const submitRef = useRef(null);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    total: "",
    balance: "",
    party: "",
  });

  const { itemNames, getItemNames, store, getItem, fetchedItem } =
    useWarehouseStore((state) => ({
      itemNames: state.itemNames,
      store: state.store,
      getItemNames: state.getItemNames,
      getItem: state.getItem,
      fetchedItem: state.fetchedItem,
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
  useEffect(() => {
    getItem(store, item.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  const handleClose = () => {
    setShow(false);
    setItem({
      name: "",
      quantity: "",
      total: "",
      balance: "",
      party: "",
    });
  };
  const getBalance = () => {
    const { total, balance, party } = item;
    const left = total - balance;

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
    const { name, quantity, total, balance, party } = item;
    console.log(name);
    const response = await fetch(`${host}/api/items/sellitem`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, party, store }),
    });
    const json = await response.json();

    const newRes = await fetch(`${host}/api/sales/addsale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        total,
        balance,
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
        total: "",
        balance: "",
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
                autoFocus
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
                  setChange((prev) => prev + 1);
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
                disabled={!item.name}
                required
                onChange={onChange}
              />
              <p className="text-muted ">
                Remaining:{" "}
                {fetchedItem[0] ? fetchedItem[0].quantity - item.quantity : ""}
              </p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="total">
              <Form.Label>Total:</Form.Label>
              <Form.Control
                type="number"
                name="total"
                required
                value={item.total}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="balance">
              <Form.Label>Balance:</Form.Label>
              <Form.Control
                type="number"
                name="balance"
                required
                value={item.balance}
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
