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
import useWarehouseStore from "../store/warehouseStore";

const SaleChart = () => {
  const location = useLocation();

  const [dataValue, setDataValue] = useState("This Month");
  const { sales, setSales, host } = useSaleStore((state) => ({
    sales: state.sales,
    host: state.host,
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
    // eslint-disable-next-line
  }, [location]);
  useEffect(() => {
    getSales();
    // eslint-disable-next-line
  }, [store]);
  let data = sales.map((sale) => {
    const newSale = {
      date: sale.date,
      total: sale.total,
    };
    return newSale;
  });
  let total = 0;

  const thisMonthData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "month")) {
      return obj;
    }
    return false;
  });
  const thisYearData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "year")) {
      return obj;
    }
    return false;
  });
  const todayData = data.filter((obj) => {
    if (moment(obj.date).isSame(new Date(), "day")) {
      return obj;
    }
    return false;
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
        return parseInt(obj.total);
      })
      .reduce((sum, current) => sum + current);
  } else {
    data = [{ total: 0, date: 0 }];
  }
  dataToShow = dataToShow.map((obj) => {
    return {
      Sale: parseInt(obj.total),
      //   date: moment(obj.date).get("date") + "" + moment(obj.date).get("month"),
      date:
        dataValue === "This Month"
          ? moment(obj.date).format("D")
          : moment(obj.date).format("M"),
    };
  });
  //   const data = [
  //     {
  //       name: "Page A",
  //       uv: 4000,
  //       pv: 2400,
  //       amt: 2400,
  //     },
  //     {
  //       name: "Page B",
  //       uv: 3000,
  //       pv: 1398,
  //       amt: 2210,
  //     },
  //     {
  //       name: "Page C",
  //       uv: 2000,
  //       pv: 9800,
  //       amt: 2290,
  //     },
  //     {
  //       name: "Page D",
  //       uv: 2780,
  //       pv: 3908,
  //       amt: 2000,
  //     },
  //     {
  //       name: "Page E",
  //       uv: 1890,
  //       pv: 4800,
  //       amt: 2181,
  //     },
  //     {
  //       name: "Page F",
  //       uv: 2390,
  //       pv: 3800,
  //       amt: 2500,
  //     },
  //     {
  //       name: "Page G",
  //       uv: 3490,
  //       pv: 4300,
  //       amt: 2100,
  //     },
  //   ];
  return (
    <>
      <Container className="mt-3 sale-div">
        <div className="d-flex justify-content-between">
          <h3>Sale</h3>
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
            <p className="sale-price">
              Rs{" "}
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(total)}
            </p>
            <p className="text-muted">
              Total Sale{" "}
              {dataValue === "This Month"
                ? `(${moment().format("MMM")})`
                : dataValue === "This Year"
                ? `(${moment().format("YYYY")})`
                : `(${moment().format("Do MMM")})`}
            </p>
          </Col>
          <Col>
            <Container className="d-flex justify-content-center">
              <LineChart
                width={600}
                height={300}
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

export default SaleChart;
