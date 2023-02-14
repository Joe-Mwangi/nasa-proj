const defaultLimit = 0
const defaultPage = 1
const defaultSort = '1'

function getPagination(query) {
    const limit = Math.abs(query.limit) || defaultLimit
    const page = Math.abs(query.page) || defaultPage
    const skip = (page - 1) * limit
    
    return {
        skip,
        limit
    }
}

function getSort(query) {
    const sort = query.sort || defaultSort
    return sort
}

module.exports = {
    getPagination,
    getSort
}