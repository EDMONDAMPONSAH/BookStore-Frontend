import { useEffect, useState } from "react";
import api from "../services/api";

const VendorSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/vendor/my-sales", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSales(res.data);
      } catch (err) {
        console.error("Failed to fetch sales", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Book Sales</h3>
      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Book</th>
              <th>Buyer</th>
              <th>Amount (GHS)</th>
              <th>Status</th>
              <th>Date Paid</th>
              <th>Ref</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, idx) => (
              <tr key={idx}>
                <td>{sale.bookTitle}</td>
                <td>{sale.buyer}</td>
                <td>{sale.amount.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      sale.status === "success"
                        ? "bg-success"
                        : sale.status === "failed"
                        ? "bg-danger"
                        : "bg-warning"
                    }`}>
                    {sale.status}
                  </span>
                </td>
                <td>{new Date(sale.datePaid).toLocaleString()}</td>
                <td>{sale.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorSalesPage;
