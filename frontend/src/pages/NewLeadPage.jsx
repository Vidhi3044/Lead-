import { useEffect } from "react";

// NewLeadPage redirects users to the public reservation page (client app)
function NewLeadPage() {
  useEffect(() => {
    // adjust this URL if your client is served at a different port/path
    window.location.href = "/reservation";
  }, []);

  return <p>Redirecting to reservation page...</p>;
}

export default NewLeadPage;