import "../../Styles/style.css";

function UserCard({ user }) {
    return (
        <div className="card h-100 shadow-sm border-0 user-card">
            <img src={user.image} alt={user.firstName} className="card-img-top img-fluid" />
            <div className="card-body d-flex flex-column">
                <div className="mb-2">
                    <span className="badge bg-primary">ID: {user.id}</span>
                </div>
                <h5 className="card-title fw-bold text-dark">{user.firstName} {user.lastName}</h5>
                <p className="card-text text-primary small mb-2"><strong>Email:</strong> {user.email}</p>
                <p className="card-text text-muted small mb-2"><strong>Teléfono:</strong> {user.phone}</p>
                <p className="card-text text-muted small"><strong>Edad:</strong> {user.age} años</p>
            </div>
        </div>
    );
}

export default UserCard;