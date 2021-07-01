export function sortTable($table, column, asc = true) {
    const dirModifier = asc ? 1 : -1
    const $tbody = $table.tBodies[0]
    const rows = Array.from($tbody.querySelectorAll('tr'))

    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column})`).textContent
        const bColText = b.querySelector(`td:nth-child(${column})`).textContent

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier)
    })

    return sortedRows
}
