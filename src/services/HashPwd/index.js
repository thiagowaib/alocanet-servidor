const HashPwd = async (pwd, salt = 10) => {
    const bcrypt = require('bcrypt')
    return await bcrypt.hash(pwd, salt)
}

module.exports = HashPwd