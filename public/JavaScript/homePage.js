fetch("/api/users")
.then((rawData) => rawData.json())
.then((response) => {
    let main = document.getElementById("main");
    response.forEach((user) => {
        let card = document.createElement("div")
        card.classList.add("card");
        card.innerHTML = `
        <p class="fullName">${user.first_name} ${user.last_name}</p>
        <p class="email">${user.email}</p>
        <p class="work">${user.Work_profession}</p>
        `
        main.appendChild(card)
    });
})
.catch(() => {
    let main = document.getElementById("main");
    let card = document.createElement("div")
        card.classList.add("card");
        card.innerHTML = `<p class="fullName">Add a user in order to see the information</p>`
        main.appendChild(card)
})