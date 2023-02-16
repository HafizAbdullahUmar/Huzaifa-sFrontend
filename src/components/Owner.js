import moment from "moment";
import React from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useNavigate } from "react-router-dom";
import useSaleStore from "../store/saleStore";
import useWarehouseStore from "../store/warehouseStore";
import PurchaseChart from "./PurchaseChart";
import SaleChart from "./SaleChart";
import TransactionItem from "./TransactionItem";

const Owner = () => {
  const navigate = useNavigate();
  const { sales, setSales, purchases, setPurchases, host } = useSaleStore(
    (state) => ({
      host: state.host,
      sales: state.sales,
      purchases: state.purchases,
      setSales: state.setSales,
      setPurchases: state.setPurchases,
    })
  );

  return (
    <>
      <Row className="ps-5 align-items-center justify-content-center">
        <Col md="6">
          <SaleChart />
        </Col>
        <Col md="5">
          <PurchaseChart />
        </Col>
      </Row>
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
        {purchases
          .map((purchase, i) => {
            return (
              <TransactionItem
                key={purchase.id}
                sale={purchase}
                type="Purchase"
                color={
                  i % 2 === 0 ? "rgb(240, 240, 240)" : "rgb(251, 251, 251)"
                }
              />
            );
          })
          .reverse()}
      </Container>
    </>
  );
};

export default Owner;
