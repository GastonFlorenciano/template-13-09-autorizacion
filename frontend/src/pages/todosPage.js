export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  const btnHome = document.createElement("button");

  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );

  btnHome.textContent = "Home";

  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");

  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const btnCreate = document.createElement("button");

  btnCreate.classList.add("bg-green-500", "text-white", "p-2", "rounded", "hover:bg-green-600", "mb-4");

  btnCreate.textContent = "Crear Tarea";

  btnCreate.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.classList.add("fixed", "inset-0", "z-10", "overflow-y-auto", "bg-gray-500", "bg-opacity-50");
    modal.innerHTML = `
      <div class="relative p-8 bg-white w-1/3 m-auto mt-10 rounded-lg">
        <span class="absolute top-0 right-0 p-2 text-xl cursor-pointer" onclick="this.parentElement.parentElement.remove()">X</span>
        <h2 class="text-2xl font-bold mb-4">Crear Tarea</h2>
        <form id="createForm">
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" name="title" class="border-2 border-gray-300 rounded-lg p-2 w-full mb-4">
          <div class="mb-4">
            <label for="completed" class="text-sm font-medium text-gray-700 mr-5">Completado?</label>
            <input type="checkbox" name="completed" class="">
          </div>
          <button type="submit" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Crear</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const createForm = modal.querySelector("#createForm");
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = createForm.title.value;
      const completed = createForm.completed.checked;

      fetch("http://localhost:4000/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, completed }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((newTodo) => {
          
          const tr = document.createElement("tr");

          const td1 = document.createElement("td");
          td1.classList.add("border", "px-4", "py-2");
          td1.textContent = newTodo.newTask.id;

          const td2 = document.createElement("td");
          td2.classList.add("border", "px-4", "py-2");
          td2.textContent = newTodo.newTask.title;

          const td3 = document.createElement("td");
          td3.classList.add("border", "px-4", "py-2");
          td3.textContent = newTodo.newTask.completed ? "Sí" : "No";

          const td4 = document.createElement("td");
          td4.classList.add("border", "px-4", "py-2");

          const btnDel = document.createElement("button");
          btnDel.textContent = "Eliminar";
          btnDel.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600", "mx-5");
          btnDel.addEventListener("click", () => {
            fetch(`http://localhost:4000/todos/delete/${newTodo.newTask.id}`, {
              method: "DELETE",
              credentials: "include",
            }).then(() => {
              tr.remove();
            });
          });

          const btnEdit = document.createElement("button");
          btnEdit.textContent = "Editar";
          btnEdit.classList.add("bg-blue-500", "text-white", "p-2", "rounded", "hover:bg-blue-600");
          btnEdit.addEventListener("click", () => {
            const modal = document.createElement("div");
            modal.classList.add("fixed", "inset-0", "z-10", "overflow-y-auto", "bg-gray-500", "bg-opacity-50");
            modal.innerHTML = `
              <div class="relative p-8 bg-white w-1/3 m-auto mt-10 rounded-lg">
                <span class="absolute top-0 right-0 p-2 text-xl cursor-pointer" onclick="this.parentElement.parentElement.remove()">X</span>
                <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
                <form id="editForm">
                  <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
                  <input type="text" name="title" value="${newTodo.newTask.title}" class="border-2 border-gray-300 rounded-lg p-2 w-full mb-4">
                  <div class="mb-4">
                    <label for="completed" class="text-sm font-medium text-gray-700 mr-5">Completado?</label>
                    <input type="checkbox" name="completed" ${newTodo.newTask.completed ? "checked" : ""} class="">
                  </div>
                  <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Hecho</button>
                </form>
              </div>
            `;
            document.body.appendChild(modal);

            const editForm = modal.querySelector("#editForm");
            editForm.addEventListener("submit", (e) => {
              e.preventDefault();
              const title = editForm.title.value;
              const completed = editForm.completed.checked;

              fetch(`http://localhost:4000/todos/edit/${newTodo.newTask.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, completed }),
                credentials: "include",
              })
                .then((response) => response.json())
                .then((updatedTodo) => {
                  console.log(updatedTodo);
                  td2.textContent = updatedTodo.todo.title; 
                  td3.textContent = updatedTodo.todo.completed ? "Sí" : "No";
                  modal.remove();
                });
            });
          });

          td4.textContent = newTodo.newTask.owner;
          td4.appendChild(btnDel);
          td4.appendChild(btnEdit);

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tbody.appendChild(tr);

          modal.remove();
        });
    });
  });

  const table = document.createElement("table");

  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-[0_7px_8px_0_gray]",
    "h-[700px]",
    "overflow-y-scroll",
    "border-2",
    "border-[#bfbfbf]",
    "rounded-[15px]"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";
  
  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Actions";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");

  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);
  container.appendChild(title);
  container.appendChild(btnCreate);
  container.appendChild(table);

  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((todo) => {

        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        
        const td5 = document.createElement("td");
        td5.classList.add("border", "px-4", "py-2");

        const btnDel = document.createElement("button");

        btnDel.textContent = "Eliminar";

        btnDel.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600", "mx-5");

        btnDel.addEventListener("click", () => {
          fetch(`http://localhost:4000/todos/delete/${todo.id}`, {
            method: "DELETE",
            credentials: "include",
          }).then(() => {
            tr.remove();
          });

        });

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.classList.add("bg-blue-500", "text-white", "p-2", "rounded", "hover:bg-blue-600");
        btnEdit.addEventListener("click", () => {
          const modal = document.createElement("div");
          modal.classList.add("fixed", "inset-0", "z-10", "overflow-y-auto", "bg-gray-500", "bg-opacity-50");
          modal.innerHTML = `
            <div class="relative p-8 bg-white w-1/3 m-auto mt-10 rounded-lg">
              <span class="absolute top-0 right-0 p-2 text-xl cursor-pointer" onclick="this.parentElement.parentElement.remove()">X</span>
              <h2 class="text-2xl font-bold mb-4">Editar Tarea</h2>
              <form id="editForm">
                <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" name="title" value="${todo.title}" class="border-2 border-gray-300 rounded-lg p-2 w-full mb-4">
                <div class="mb-4">
                  <label for="completed" class="text-sm font-medium text-gray-700 mr-5">Completado?</label>
                  <input type="checkbox" name="completed" ${todo.completed ? "checked" : ""} class="">
                </div>
                <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Hecho</button>
              </form>
            </div>
          `;
          document.body.appendChild(modal);

          const editForm = modal.querySelector("#editForm");
          editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = editForm.title.value;
            const completed = editForm.completed.checked;

            fetch(`http://localhost:4000/todos/edit/${todo.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, completed }),
              credentials: "include",
            })
              .then((response) => response.json())
              .then((updatedTodo) => {
                td2.textContent = updatedTodo.todo.title; 
                td3.textContent = updatedTodo.todo.completed ? "Sí" : "No";
                modal.remove();
              });
          });
        });

        td4.textContent = todo.owner;

        td5.appendChild(btnDel);
        td5.appendChild(btnEdit);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    });

  return container;
};