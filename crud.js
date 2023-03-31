const d = document,
	$form = d.querySelector(".crud-form"),
	$title = d.querySelector(".form-title"),
	$btnForm = d.querySelector(".btn-form"),
	$table = d.querySelector(".crud-table"),
	$template = d.getElementById("crud-template").content,
	$fragment = d.createDocumentFragment();

let urlUsers = "http://localhost:3000/users";

const getUsers = async () => {
	let res = await fetch(urlUsers),
		json = await res.json();

	json.map((el) => {
		$template.querySelector(".name").textContent = `${el.name[0].toUpperCase()}${el.name.slice(1)}`;
		$template.querySelector(
			".constellation"
		).textContent = `${el.constellation[0].toUpperCase()}${el.constellation.slice(1)}`;
		$template.querySelector(".age").textContent = el.age;

		$template.querySelector(".edit").dataset.id = el.id;
		$template.querySelector(".edit").dataset.name = el.name;
		$template.querySelector(".edit").dataset.constellation = el.constellation;
		$template.querySelector(".edit").dataset.age = el.age;

		$template.querySelector(".delete").dataset.id = el.id;
		$template.querySelector(".delete").dataset.name = el.name;

		let $clone = d.importNode($template, true);
		$fragment.appendChild($clone);
	});

	$table.appendChild($fragment);
};

const operations = async (data) => {
	if (!data.id) {
		//Post
		let resPost = await fetch(urlUsers, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		location.reload();
	} else if (!data.name) {
		//DELETE
		let resDelete = await fetch(`${urlUsers}/${data.id}`, {
			method: "DELETE",
		});

		location.reload();
	} else {
		//PUT
		let resUpdate = await fetch(`${urlUsers}/${data.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	}
};

d.addEventListener("DOMContentLoaded", getUsers);

d.addEventListener("submit", (e) => {
	e.preventDefault();
	if (e.target === $form) {
		operations({
			id: $btnForm.dataset.id || null,
			name: e.target.name.value.toLowerCase(),
			constellation: e.target.constellation.value.toLowerCase(),
			age: e.target.age.value,
		});
	}
});

d.addEventListener("click", (e) => {
	if (e.target.matches(".edit")) {
		$title.textContent = `Edita tu informacion :)`;
		$btnForm.value = "Editar";

		$btnForm.dataset.id = e.target.dataset.id;
		$form.name.value = e.target.dataset.name;
		$form.constellation.value = e.target.dataset.constellation;
		$form.age.value = e.target.dataset.age;
	}
	if (e.target.matches(".delete")) {
		isDelete = confirm(`Estas seguro de eliminar a ${e.target.dataset.name}`);

		if (isDelete) {
			operations({ id: e.target.dataset.id });
		}
	}
});

d.addEventListener("reset", (e) => {
	location.reload();
});
