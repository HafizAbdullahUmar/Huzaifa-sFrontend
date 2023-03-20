import React, { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import useSaleStore from "../store/saleStore";
import TransactionItem from "./TransactionItem";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import useWarehouseStore from "../store/warehouseStore";
import Button from "react-bootstrap/esm/Button";
import useKhataStore from "../store/khataStore";

const Sale = () => {
  const { sales, setSales, host } = useSaleStore((state) => ({
    host: state.host,
    sales: state.sales,
    setSales: state.setSales,
  }));
  const { store } = useWarehouseStore((state) => ({
    store: state.store,
  }));
  const { transactions, setTransactions } = useKhataStore((state) => ({
    transactions: state.transactions,
    setTransactions: state.setTransactions,
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
  const getTransactions = async () => {
    const response = await fetch(`${host}/api/sales/fetchalltrans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ store }),
    });
    const json = await response.json();

    setTransactions(json);
  };

  useEffect(() => {
    getSales();
    getTransactions();
    // getPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);
  return (
    <>
      <Container className="mt-5 text-center">
        <h1>Transaction History</h1>
        <Container className="mt-5">
          <Container
            className="trans-item d-flex justify-content-center align-items-center py-2"
            style={{ backgroundColor: "black", color: "white" }}
          >
            <Row className="trans-row">
              <Col md={2}>
                <p className="item-date fw-bold">Date</p>
              </Col>
              <Col md={2}>
                <p className="item-date fw-bold">Type</p>
              </Col>
              <Col md={2}>
                <p className="item-type fw-bold">Party</p>
              </Col>

              <Col md={2}>
                <p className="item-price">
                  <span className="fw-bold">Total</span>
                </p>
              </Col>
              <Col md={2}>
                <p className="item-quantity">
                  <span className="fw-bold">Recieved</span>
                </p>
              </Col>
              <Col md={2}>
                <p className="fw-bold">Details</p>
              </Col>
            </Row>
          </Container>
          {transactions.map((trans, i) => {
            return (
              <TransactionItem
                key={trans.id}
                sOrP={trans}
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
