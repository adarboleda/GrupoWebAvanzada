import UserCard from './UserCard';

function UserList({ users }) {
    return (
        <div className="row g-4">
            {users.map(user => (
                <div key={user.id} className="col-lg-3 col-md-6 col-sm-12">
                    <UserCard user={user} />
                </div>
            ))}
        </div>
    );
}

export default UserList;