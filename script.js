const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $btnForm = d.querySelector(".btn-form"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const $content = d.querySelector(".crud-table .content-table"),
  usersUrl = "http://localhost:3000/users";

const getUsers = async () => {

	try {
		let res = await fetch(usersUrl),
			json = await res.json();

		if (!res.ok) throw { status: res.status, statusText: res.statusText };

    json.forEach((el) => {
			$template.querySelector(".name").textContent = el.name;
      $template.querySelector(".constellation").textContent = el.constellation;
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

    $table.querySelector("tbody").appendChild($fragment);   

	} catch (err) {
    let message = err.statusText || "Ocurrio un error";

    $table.insertAdjacentElement("afterend", `<p><b> Error ${err.status}: ${message} </b></p>`)
	}
};


const operation = async (data) => {
  
  try {
    if (!data.id) {
      let resPost = await fetch(usersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      })      

      if(!resPost.ok) throw {status: resPost.status, statusText: resPost.statusText}
    }

  } catch (err) {
    console.log(err);
  }
  
};

d.addEventListener("DOMContentLoaded", getUsers);

d.addEventListener("submit", (e) => {
	if (e.target === $form) {
    e.preventDefault();

    operation({
      name: e.target.name.value,
      constellation: e.target.constellation.value,
      age: e.target.age.value
    })
	}
});

d.addEventListener("click", e => {
  if (e.target.matches(".edit")) {
    $title.textContent = `Editar Santo`;
    $btnForm.value = `Editar`;

    console.log(e.target.dataset.age);
    $form.name.value = e.target.dataset.name;
    $form.constellation.value = e.target.dataset.constellation;
    $form.age.value = e.target.dataset.age;
    $btnForm.dataset.id = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let isDelete = confirm(`Estas seguro de eliminar a ${e.target.dataset.name}`)

    if (isDelete) {
      operation({
        id: e.target.dataset.id
      })
    }
  }
})