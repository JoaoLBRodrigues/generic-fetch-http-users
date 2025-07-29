import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";

const fetchApiGet: string = "https://jsonplaceholder.typicode.com/users";

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
	const [loading, setLoading] = useState(true);
	const newUserRef = useRef<HTMLInputElement>(null);

	const getData = () => {
		setLoading(true);
		fetch(fetchApiGet)
			.then((res) => res.json())
			.then((data) => {
				setUser(data);
				console.log(data);
			})
			.catch((err) => console.log("failed api call" + err))
			.finally(() => setLoading(false));
	};

	const Delete = (id: number) => {
		//Optimisc update
		const newList = users.filter((u) => u.id !== id);
		setUser(newList);

		fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
			.then(() => alert("User deleted Successfuly"))
			.catch((err) => console.log("error deleting" + err));
	};

	const Edit = (id: number) => {
		//Optimisc update
		const newList = users.map((u) =>
			u.id == id ? { ...u, name: "updated name" } : u
		);
		setUser(newList);

		fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "updated value",
			}),
		})
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

		fetch(`https://jsonplaceholder.typicode.com/users`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
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
		getData();
	}, []);

	useEffect(() => {}, [newUserRef.current?.value]);

	if (loading) return "Loading...";

	if (users.length === undefined && !loading) return "Non user exist";

	return (
		<div className="py-5">
			<h4 className="text-center">List of users</h4>
			<div className="ms-3 pt-5 d-flex">
				<Button className="bg-primary" onClick={() => Add()}>
					Add new user
				</Button>
				<div className="px-2 align-self-center">
					<input ref={newUserRef} placeholder="Add name"></input>
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
								onClick={() => Edit(u.id)}
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
