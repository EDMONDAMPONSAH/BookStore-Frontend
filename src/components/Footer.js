const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-3 shadow-sm">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} BookStore. All rights reserved.
        </p>
        <small>Powered by Edmond Amponsah Nyame</small>
      </div>
    </footer>
  );
};

export default Footer;
