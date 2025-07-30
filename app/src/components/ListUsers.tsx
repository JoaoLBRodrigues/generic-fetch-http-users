import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { CanceledError } from "../services/api-client";
import UserService, { type IUser } from "../services/userService";
import userService from "../services/userService";

export default function ListUsers() {
	const [users, setUser] = useState<IUser[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const newUserRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setLoading(true);
		const { request, cancel } = UserService.getAllUsers();
		request
			.then((res) => setUser(res.data))
			.catch((err) => {
				if (err instanceof CanceledError) return; //this only work with axios
				setError(err);
			})
			.finally(() => setLoading(false));

		return () => cancel();
	}, []);

	const Delete = (id: number) => {
		//Optimisc update
		const newList = users.filter((u) => u.id !== id);
		setUser(newList);

		UserService.deleteUsers(id)
			.then(() => alert("User deleted Successfuly"))
			.catch((err) => console.log("error deleting" + err));
	};

	const Edit = (user: IUser) => {
		//Optimisc update
		const updatedUser = { ...user, name: "updated name" };
		setUser(users.map((u) => (u.id === user.id ? updatedUser : u)));

		userService
			.editUsers(user, updatedUser)
			.then(() => console.log("User updated Successfuly"))
			.catch((err) => console.log("error deleting" + err));
	};

	const Add = () => {
		//pessimist update
		const newUser: IUser = {
			name: newUserRef.current?.value,
			id: users.length + 1,
		};

		userService
			.addUser(newUser)
			.then(() => setUser([...users, newUser]))
			.catch((err) => console.log("error submiting" + err))
			.finally(() => {
				if (newUserRef.current) {
					newUserRef.current.value = "";
				}
			});
	};

	if (isLoading) return "Loading...";

	if ((users.length === undefined && !isLoading) || error != null)
		return "Non user exist";

	return (
		<div className="py-5">
			<h4 className="text-center">List of users</h4>
			<div className="ms-3 pt-5 d-flex">
				<Button className="bg-primary" onClick={() => Add()}>
					Add new user
				</Button>
				<div className="px-2 align-self-center">
					<input ref={newUserRef} placeholder="Add name"></input>{" "}
					{/** implement with useState to update button state */}
				</div>
			</div>
			<ListGroup className="py-4">
				{users.map((u: IUser) => (
					<ListGroup.Item
						key={u.id}
						className="d-flex justify-content-between align-items-center"
					>
						<div className="fw-bold">{u.name}</div>

						<div className="d-flex gap-2">
							<Button
								className="bg-warning ml-auto"
								onClick={() => Edit(u)}
							>
								Edit
							</Button>
							<Button
								className="bg-danger"
								onClick={() => Delete(u.id)}
							>
								Delete
							</Button>
						</div>
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	);
}
