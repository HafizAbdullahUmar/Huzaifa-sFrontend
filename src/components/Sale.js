import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import useSaleStore from "../store/saleStore";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TransactionItem from "./TransactionItem";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

const Sale = () => {
  const [key, setKey] = useState("sales");
  const { sales, setSales, purchases, setPurchases, host } = useSaleStore(
    (state) => ({
      host: state.host,
      sales: state.sales,
      purchases: state.purchases,
      setSales: state.setSales,
      setPurchases: state.setPurchases,
    })
  );
  const getSales = async () => {
    const response = await fetch(`${host}/api/sales/fetchallsales`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    setSales(json);
  };
  const getPurchases = async () => {
    const response = await fetch(`${host}/api/sales/fetchallpurchases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    setPurchases(json);
  };
  useEffect(() => {
    getSales();
    getPurchases();
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
              <Col md={3}>
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
              <Col md={2}>
                <p className="item-quantity">
                  <span className="fw-bold">Quantity</span>
                </p>
              </Col>
            </Row>
          </Container>
          {sales.map((sale, i) => {
            return (
              <TransactionItem
                key={sale.id}
                sale={sale}
                type="Sale"
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
