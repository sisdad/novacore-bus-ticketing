const navigate = useNavigate();

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

useEffect(() => {

    if (!token) {
        navigate("/");
        return;
    }

    if (role !== "manager") {
        navigate("/unauthorized");
    }

}, [navigate, token, role]);