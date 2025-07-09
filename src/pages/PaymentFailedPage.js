import { useSearchParams } from "react-router-dom";

const PaymentFailedPage = () => {
  const [params] = useSearchParams();
  const reference = params.get("ref");

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger">Payment Failed ❌</h2>
      <p>Something went wrong during payment.</p>
      <p>
        Reference: <strong>{reference}</strong>
      </p>
    </div>
  );
};

export default PaymentFailedPage;
