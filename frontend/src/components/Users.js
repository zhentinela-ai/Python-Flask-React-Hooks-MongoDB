import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const API = process.env.REACT_APP_API;

function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editing) {
      await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
    } else {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data)
      setEditing(false)
      setId("")
    }

    await getUsers();

    setName("");
    setEmail("");
    setPassword("");
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const updateUser = async (id) => {
    const res = await fetch(`${API}/user/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
  };

  const deleteUser = async (id) => {
    const userResponse = await window.confirm(
      "Are you sure you want to delete it?"
    );
    if (userResponse) {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
      await res.json();
      await getUsers();
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body bg-dark">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              placeholder="Name"
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-control"
              placeholder="Password"
            />
          </div>
          <button className="btn btn-primary block">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>

      <div className="col-md-8">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <th>{user.name}</th>
                  <th>{user.email}</th>
                  <th>{user.password}</th>
                  <th className="form-group d-flex justify-content-between">
                    <button
                      className="btn btn-secondary btn-block btn-sm"
                      onClick={(e) => updateUser(user._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-block btn-sm"
                      onClick={(e) => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
