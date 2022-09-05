const AuthPwd = async (hash, pwd) => {
    const bcrypt = require('bcrypt')
    return await bcrypt.compare(pwd, hash)
}

module.exports = AuthPwd