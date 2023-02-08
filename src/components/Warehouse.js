import React, { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import useWarehouseStore from "../store/warehouseStore";
import WarehouseItem from "./WarehouseItem";
import Row from "react-bootstrap/Row";
import AddItem from "./AddItem";
import EditItem from "./EditItem";

const Warehouse = () => {
  const host = "http://192.168.10.2:5000";
  const { items, setItems } = useWarehouseStore((state) => ({
    items: state.items,
    addItem: state.addItem,
    setItems: state.setItems,
  }));
  console.log(items);
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
        <Row className="gap-4 justify-content-center">
          {items.map((item) => {
            return <WarehouseItem item={item} key={item._id} />;
          })}
        </Row>
      </Container>
    </>
  );
};

export default Warehouse;
