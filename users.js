import bcrypt from 'bcrypt'

const users = []

/**
 * @returns user or undefined if not found
 */
export const getUserByEmail = (email) => users.find((user) => user.email === email)

export const addUser = ({ name, email, password }) => {
  const hash = bcrypt.hashSync(password, 10)
  users.push({
    id: Date.now().toString(),
    name,
    email,
    hash
  })
}

export const getUserById = (id) => users.find((user) => user.id === id)