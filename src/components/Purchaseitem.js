import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import useWarehouseStore from "../store/warehouseStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import useSaleStore from "../store/saleStore";
import { Autocomplete, TextField } from "@mui/material";

const Purchaseitem = () => {
  const [show, setShow] = useState(false);
  const [gave, setGave] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [item, setItem] = useState({
    name: "",
    quantity: "",
    price: "",
    party: "",
  });

  const { itemNames, getItemNames, host, store } = useWarehouseStore(
    (state) => ({
      itemNames: state.itemNames,
      getItemNames: state.getItemNames,
      host: state.host,
      store: state.store,
    })
  );
  const { setPurchases, purchases } = useSaleStore((state) => ({
    purchases: state.purchases,
    setPurchases: state.setPurchases,
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
    setGave("");
    setItem({
      name: "",
      quantity: "",
      price: "",
      party: "",
    });
  };
  const getBalance = () => {
    const { price, quantity, party } = item;
    const left = -(quantity * price - gave);

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
  const handleSubmit = async () => {
    const { name, quantity, price, party } = item;
    getBalance();

    setIsSubmitDisabled(true);

    fetch(`${host}/api/items/purchaseitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price, store }),
    }).then(async (res) => {
      const json = await res.json();
      if (!json.success) {
        console.log(item);
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
            store,
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
    console.log(item);
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
                freeSolo
                id="combo-box-demo"
                options={itemNames}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    name="name"
                    onChange={(e, value) => {
                      onChange(e);
                    }}
                    onFocus={(e, value) => {
                      onChange(e);
                    }}
                    {...params}
                    label=""
                  />
                )}
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
          <p className="h5 tw-normal">
            Total Price:{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(item.price * item.quantity)}
          </p>
          <Form.Group className="mb-3" controlId="gave">
            <Form.Label>Gave:</Form.Label>
            <Form.Control
              type="number"
              name="gave"
              required
              value={gave}
              onChange={(e) => {
                setGave(e.target.value);
              }}
            />
          </Form.Group>
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
