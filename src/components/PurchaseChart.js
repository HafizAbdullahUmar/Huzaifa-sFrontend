import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import useSaleStore from "../store/saleStore";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import moment from "moment";
import { useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const PurchaseChart = () => {
  const location = useLocation();

  const [dataValue, setDataValue] = useState("This Month");
  const { purchases, setPurchases, host } = useSaleStore((state) => ({
    purchases: state.purchases,
    host: state.host,
    setPurchases: state.setPurchases,
  }));
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
    getPurchases();
    // eslint-disable-next-line
  }, [location]);
  let data = purchases.map((purchase) => {
    const newPurchase = {
      date: purchase.date,
      price: purchase.price,
    };
    return newPurchase;
  });
  let total = 0;

  const thisMonthData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "month")) {
      return obj;
    }
  });
  const thisYearData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "year")) {
      return obj;
    }
  });
  const todayData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "day")) {
      return obj;
    }
  });
  let dataToShow = [];
  if (dataValue === "This Month") {
    dataToShow = thisMonthData;
  } else if (dataValue === "This Year") {
    dataToShow = thisYearData;
  } else if (dataValue === "Today") {
    dataToShow = todayData;
  }
  if (dataToShow.length !== 0) {
    total = dataToShow
      .map((obj) => {
        return parseInt(obj.price);
      })
      .reduce((sum, current) => sum + current);
  } else {
    data = [{ price: 0, date: 0 }];
  }
  dataToShow = dataToShow.map((obj) => {
    return {
      Sale: parseInt(obj.price),
      date:
        dataValue === "This Month"
          ? moment(obj.date).format("Do")
          : moment(obj.date).format("MMM"),
    };
  });
  return (
    <>
      <Container className="mt-3 purchase-div ">
        <div className="d-flex justify-content-between">
          <h3>Purchase</h3>
          <DropdownButton
            id="dropdown-basic-button"
            variant="secondary"
            title={dataValue}
          >
            <Dropdown.Item
              onClick={() => {
                setDataValue("This Month");
              }}
            >
              This Month
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setDataValue("This Year");
              }}
            >
              This Year
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setDataValue("Today");
              }}
            >
              Today
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <Row className="pt-4">
          <Col md="3" className="sale-col-1">
            <p className="purchase-price">
              Rs{" "}
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(total)}
            </p>
            <p className="text-muted">
              Total Purchase{" "}
              {dataValue === "This Month"
                ? `(${moment().format("MMM")})`
                : dataValue === "This Year"
                ? `(${moment().format("YYYY")})`
                : `(${moment().format("Do MMM")})`}
            </p>
          </Col>
          <Col>
            <Container className="d-flex justify-content-start">
              <LineChart
                width={400}
                height={200}
                data={dataToShow}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Sale"
                  stroke="#8884d8"
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PurchaseChart;
