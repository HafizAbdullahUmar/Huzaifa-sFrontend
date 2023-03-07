import React, { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import useSaleStore from "../store/saleStore";
import TransactionItem from "./TransactionItem";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import useWarehouseStore from "../store/warehouseStore";

const Sale = () => {
  const { sales, setSales, host } = useSaleStore((state) => ({
    host: state.host,
    sales: state.sales,
    setSales: state.setSales,
  }));
  const { store } = useWarehouseStore((state) => ({
    store: state.store,
  }));
  const getSales = async () => {
    const response = await fetch(`${host}/api/sales/fetchallsales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ store }),
    });
    const json = await response.json();

    setSales(json);
  };

  useEffect(() => {
    getSales();
    // getPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container className="mt-5 text-center">
        <h1>Sales History</h1>
        <Container className="mt-5">
          <Container
            className="trans-item d-flex justify-content-center align-items-center py-2"
            style={{ backgroundColor: "black", color: "white" }}
          >
            <Row className="trans-row">
              <Col md={2}>
                <p className="item-date">Date</p>
              </Col>
              <Col md={2}>
                <p className="item-type fw-bold">Party</p>
              </Col>
              <Col md={3}>
                <p className="item-name">
                  {" "}
                  <span className="fw-bold">Item Name</span>
                </p>
              </Col>
              <Col md={2}>
                <p className="item-price">
                  <span className="fw-bold">Price</span>
                </p>
              </Col>
              <Col md={1}>
                <p className="item-quantity">
                  <span className="fw-bold">Quantity</span>
                </p>
              </Col>
              <Col md={2}>
                <p className="item-status">
                  <span className="fw-bold">Status</span>
                </p>
              </Col>
            </Row>
          </Container>
          {sales.map((sale, i) => {
            return (
              <TransactionItem
                key={sale.id}
                sOrP={sale}
                type="S"
                color={
                  i % 2 === 0 ? "rgb(240, 240, 240)" : "rgb(251, 251, 251)"
                }
              />
            );
          })}
        </Container>
      </Container>
    </>
  );
};

export default Sale;
