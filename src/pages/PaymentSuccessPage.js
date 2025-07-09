import { useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const reference = params.get("ref");

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success">Payment Successful </h2>
      <p>Thank you for your purchase!</p>
      <p>
        Reference: <strong>{reference}</strong>
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
