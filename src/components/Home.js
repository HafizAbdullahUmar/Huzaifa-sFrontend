import React, { useEffect } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import useKhataStore from "../store/khataStore";
import Purchaseitem from "./Purchaseitem";
import SaleChart from "./SaleChart";
import Sellitem from "./Sellitem";
import YouwillPay from "./YouwillPay";
import YouwillRecieve from "./YouwillRecieve";

const Home = () => {
  const { getDues } = useKhataStore((state) => ({
    getDues: state.getDues,
  }));
  useEffect(() => {
    getDues();
  }, []);
  return (
    <>
      <Container className="d-flex justify-content-end pt-3">
        <Sellitem />
        <Purchaseitem />
      </Container>
      <Row className="ps-5 align-items-center justify-content-center">
        <Col md="6">
          <SaleChart />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="3">
          <YouwillRecieve />
        </Col>
        <Col md="3">
          <YouwillPay />
        </Col>
      </Row>
    </>
  );
};

export default Home;
