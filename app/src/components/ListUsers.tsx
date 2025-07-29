import React from "react";
import { Button, ListGroup } from "react-bootstrap";

export default function ListUsers() {
	return (
		<div className="py-5">
			<h4 className="text-center">List of users</h4>
			<div className="ms-3 pt-5">
				<Button className="bg-primary ">Add new user</Button>
			</div>
			<ListGroup className="py-4">
				<ListGroup.Item className="d-flex justify-content-between align-items-center">
					<div className="fw-bold">text</div>

					<div className="d-flex gap-2">
						<Button className="bg-warning ml-auto">Edit</Button>
						<Button className="bg-danger">Delete</Button>
					</div>
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
