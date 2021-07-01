import {sortTable} from './sort-table'

const renderTBodyRow = (data) => {
    const {id, name, username, email, website} = data

    return `<tr>
        <td data-id=${id}>${name}</td>
        <td data-id=${id}>${username}</td>
        <td data-id=${id}>${email}</td>
        <td data-id=${id}>${website}</td>
        <td><button aria-label="delete this row of table" data-delete=${id}>delete</button></td>
    </tr>`
}

const renderUserModal = (user) => {
    const {name, username, email, address, phone, website, company} = user

    return `<button class="js-close-modal close-modal">X</button>
        <h2>${name}</h2>
        <p>Username: ${username}</p>
        <p>${email}</p>
        <address>
            <p>Street: ${address.street}</p>
            <p>Suite: ${address.suite}</p>
            <p>City: ${address.city}</p>
            <p>Zipcode: ${address.zipcode}</p>
        </address>
        <p>Phone: ${phone}</p>
        <p>Website: ${website}</p>
        <p>Company: ${company.name}</p>
        <p>Catch Phrase of Company: ${company.catchPhrase}</p>`
}

const renderTBody = (data, $tbody) => {
    data.forEach(item => {
        $tbody.insertAdjacentHTML('beforeend', renderTBodyRow(item))
    })
}

async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    return await response.json()
}

(async function main() {
    const $userTable = document.getElementById('user-table')
    const $tbody = document.getElementById('user-table-body')
    const $userModalWindow = document.getElementById('user-modal')
    const $userForm = document.getElementById('user-form')

    let users = await getUsers()

    renderTBody(users, $tbody)

    $userTable.addEventListener('click', function(e) {
        e.stopPropagation()
        const targetDataset = e.target.dataset

        if (targetDataset.id) {
            const user = users.find(user => user.id === +targetDataset.id)
            $userModalWindow.innerHTML = renderUserModal(user)
            $userModalWindow.classList.add('modal-open')
        }

        if (targetDataset.delete) {
            users = users.filter(user => user.id !== +targetDataset.delete)
            // button -> td -> tr -> remove
            e.target.parentNode.parentNode.remove()
        }

        if (targetDataset.column) {
            e.target.classList.toggle('is-asc')
            const sortedRows = sortTable($userTable, +targetDataset.column, !e.target.classList.contains('is-asc'))
            $tbody.innerHTML = ''
            console.log(sortedRows)
            sortedRows.forEach(item => {
                $tbody.appendChild(item)
            })
        }
    })

    $userForm.addEventListener('submit', function(e) {
        e.preventDefault()
        const {fullname, nickname, email, website, phone, street, suite, city, zipcode, companyName, catchPhrase} = e.target.elements

        if (!fullname.value.trim() || !nickname.value.trim() || !email.value.trim() || !website.value.trim()) {
            return alert('Full name, nickname, email, website fields are required')
        }

        const newUser = {
            id: users.length + 1,
            name: fullname.value,
            username: nickname.value,
            email: email.value,
            address: {
                street: street.value ? street.value : 'not specified',
                suite: suite.value ? suite.value : 'not specified',
                city: city.value ? city.value : 'not specified',
                zipcode: zipcode.value ? zipcode.value : 'not specified',
            },
            phone: phone.value ? phone.value : 'not specified',
            website: website.value,
            company: {
                name: companyName.value ? companyName.value : 'not specified',
                catchPhrase: catchPhrase.value ? catchPhrase.value : 'not specified',
            }
        }

        users.unshift(newUser)
        $tbody.insertAdjacentHTML('beforeend', renderTBodyRow(newUser))

        this.reset()
    })

    function userModalClose() {
        $userModalWindow.classList.remove('modal-open')
    }

    document.body.addEventListener('click', function () {
        userModalClose()
    })

    $userModalWindow.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.classList.contains('js-close-modal')) {
            userModalClose()
        }
    })
})()
