import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import useSaleStore from "../store/saleStore";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TransactionItem from "./TransactionItem";

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
    console.log("this is before", json);
    setPurchases(json);
    console.log("this is after", purchases);
  };
  useEffect(() => {
    getSales();
    getPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Container className="mt-5 text-center">
        <h1>Transactions History</h1>
        <Tabs
          id="transactions-history"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="my-4 trans"
          fill
        >
          <Tab eventKey="sales" title="Sales">
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
          </Tab>
          {/*  <Tab eventKey="purchases" title="Purchases">
            {purchases
              .map((purchase, i) => {
                console.log("this is it", purchase);
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
          </Tab> */}
        </Tabs>
      </Container>
    </>
  );
};

export default Sale;
