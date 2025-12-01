import { useFetch } from "./Hook/useFetch";
import { getUsers } from "./Services/userServices";
import UserList from "./Components/Products/UserList";
import Loading from "./Components/Products/Loading";
import "./Styles/style.css";

function App() {
  const { data: users, loading, error } = useFetch(getUsers);
  return (
    <div className="app-wrapper">
      <div className="container py-5">
        <div className="header-container text-center mb-5">
          <div className="header-content">
            <h1 className="header-title">Directorio de Usuarios</h1>
            <div className="header-divider"></div>
            <p className="header-subtitle">Directorio de usuarios</p>
          </div>
        </div>
        {loading && <Loading />}
        {error && <div className="alert alert-danger text-center" role="alert">{error.message}</div>}
        {!loading && !error && <UserList users={users} />}
      </div>
    </div>
  );
}

export default App;
