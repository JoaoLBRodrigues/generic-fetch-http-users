import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import apiClient, { CanceledError } from "../services/api-client";

interface IUser {
	id: number;
	name: string | undefined;
	username?: string;
	email?: string;
	phone?: number;
	webSite?: string;
}

export default function ListUsers() {
	const [users, setUser] = useState<IUser[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const newUserRef = useRef<HTMLInputElement>(null);

	const getData = (controller: AbortController) => {
		setLoading(true);
		apiClient("/users", { signal: controller.signal })
			.then((res) => {
				setUser(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				if (err instanceof CanceledError) return; //this only work with axios
				setError(err);
			})
			.finally(() => setLoading(false));
	};

	const Delete = (id: number) => {
		//Optimisc update
		const newList = users.filter((u) => u.id !== id);
		setUser(newList);

		apiClient(`users/${id}`)
			.then(() => alert("User deleted Successfuly"))
			.catch((err) => console.log("error deleting" + err));
	};

	const Edit = (user: IUser) => {
		//Optimisc update
		const updatedUser = { ...user, name: "updated name" };
		setUser(users.map((u) => (u.id === user.id ? updatedUser : u)));

		apiClient
			.patch(`users/${user.id}`, updatedUser)
			.then(() => console.log("User updated Successfuly"))
			.catch((err) => console.log("error deleting" + err));
	};

	const Add = () => {
		//Optimisc update
		setUser([
			...users,
			{
				name: newUserRef.current?.value,
				id: users.length + 1,
			},
		]);

		apiClient
			.post(`https://jsonplaceholder.typicode.com/users`, {
				body: JSON.stringify({
					name: newUserRef.current?.value,
				}),
			})
			.then(() => console.log("User Submited Successfuly"))
			.catch((err) => console.log("error submiting" + err))
			.finally(() => {
				if (newUserRef.current) {
					newUserRef.current.value = "";
				}
			});
	};

	useEffect(() => {
		const controller = new AbortController(); // abort fetch if not needed
		getData(controller);

		return () => controller.abort(); //cleaner function
	}, []);

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
