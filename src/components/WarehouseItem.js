import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import useWarehouseStore from "../store/warehouseStore";
import { toast } from "react-toastify";

const WarehouseItem = ({ item }) => {
  const { setEditModale, setEditItem, setItems, items, host } =
    useWarehouseStore((state) => ({
      setEditModale: state.setEditModale,
      setEditItem: state.setEditItem,
      setItems: state.setItems,
      host: state.host,
      items: state.items,
    }));
  const { name, quantity, price } = item;

  const deleteItem = () => {
    // API Call
    fetch(`${host}/api/items/deleteitem/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": localStorage.getItem("token"),
      },
    }).then(() => {
      toast.success("Item Deleted", {
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
    console.log("Deleting Item with id ", item._id);
    const tempItems = JSON.parse(JSON.stringify(items));
    const newItems = tempItems.filter((tempItem) => tempItem._id !== item._id);
    setItems(newItems);
    setEditModale(false);
  };
  return (
    <Col className="p-0" style={{ maxWidth: "312px" }}>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            <div className="d-flex align-items-center">
              {name}
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="mx-2 icon"
                onClick={() => {
                  setEditModale(true);
                  setEditItem(item);
                }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="icon"
                onClick={deleteItem}
              />
            </div>
          </Card.Title>
          <Card.Text>Quantity: {quantity}</Card.Text>
          <Card.Text>Price(Rs): {price}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default WarehouseItem;
