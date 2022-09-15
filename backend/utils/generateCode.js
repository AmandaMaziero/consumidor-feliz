function generateCode() {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < 6; i++) {
        i == 0 ? code = caracteres.charAt(Math.floor(Math.random() * caracteres.length)) :
            code += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }

    return code
}

module.exports = generateCode