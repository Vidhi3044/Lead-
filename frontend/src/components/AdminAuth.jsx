import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
        console.log("verifyAdmin started");
      const verified =
        sessionStorage.getItem("adminVerified");

      if (verified === "true") return;
        console.log("Opening popup");

      const result = await Swal.fire({
  title: "Admin Login",

  html: `
    <input
      id="swal-email"
      class="swal2-input"
      placeholder="Email"
    />

    <input
      id="swal-password"
      type="password"
      class="swal2-input"
      placeholder="Password"
    />
  `,

  confirmButtonText: "Login",
  allowOutsideClick: false,
  allowEscapeKey: false,

  preConfirm: () => {
    const email =
      document.getElementById("swal-email").value;

    const password =
      document.getElementById("swal-password").value;

    return { email, password };
  },
});

console.log("RESULT:", result);

const formValues = result.value;
        console.log("FORM VALUES:", formValues);
console.log("EMAIL:", formValues?.email);
console.log("PASSWORD:", formValues?.password);

console.log(
  formValues?.email === "nktech@gmail.com"
);

console.log(
  formValues?.password === "Hawahawai123"
);

      if (
        formValues?.email ===
          "nktech@gmail.com" &&
        formValues?.password ===
          "Hawahawai123"
      ) {
        sessionStorage.setItem(
          "adminVerified",
          "true"
        );

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Invalid Credentials",
        });

        navigate("/");
      }
    };

    verifyAdmin();
  }, [navigate]);

  return children;
}

export default AdminAuth;