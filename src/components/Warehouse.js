import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import useWarehouseStore from "../store/warehouseStore";
import WarehouseItem from "./WarehouseItem";
import Row from "react-bootstrap/Row";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import Form from "react-bootstrap/Form";

const Warehouse = () => {
  const [searchValue, setSearchValue] = useState("");
  const { items, setItems, host } = useWarehouseStore((state) => ({
    items: state.items,
    host: state.host,
    setItems: state.setItems,
  }));
  const getItems = async () => {
    const response = await fetch(`${host}/api/items/fetchallitems`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    setItems(json);
  };
  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Container>
        <div className="my-4 d-flex">
          <h1>Warehouse</h1>
          <AddItem />
          <EditItem />
        </div>
        <Container className="d-flex justify-content-center align-items-center my-3">
          <h3>Search Items:</h3>
          <Form.Control
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </Container>
        <Row className="gap-4 justify-content-center">
          {items.map((item) => {
            if (item.name.toLowerCase().includes(searchValue.toLowerCase())) {
              return <WarehouseItem item={item} key={item._id} />;
            }
            return null;
          })}
        </Row>
      </Container>
    </>
  );
};

export default Warehouse;
