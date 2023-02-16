import moment from "moment";
import React from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

const TransactionItem = (props) => {
  const { type, color, sale } = props;
  const { name, price, quantity, date, customer } = sale;

  return (
    <>
      <Container
        className="trans-item d-flex justify-content-center align-items-center py-2"
        style={{ backgroundColor: color }}
      >
        <Row className="trans-row">
          <Col md={3}>
            <p className="item-date">
              <span className="fw-bold">{moment(date).format("LL")}</span>
            </p>
          </Col>
          <Col md={2}>
            <p className="item-type fw-bold">{customer}</p>
          </Col>
          <Col md={3}>
            <p className="item-name">
              {" "}
              <span className="fw-bold">{name}</span>
            </p>
          </Col>
          <Col md={2}>
            <p className="item-price">
              Price(Rs): <span className="fw-bold">{price}</span>
            </p>
          </Col>
          <Col md={2}>
            <p className="item-quantity">
              Quantity: <span className="fw-bold">{quantity}</span>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TransactionItem;
