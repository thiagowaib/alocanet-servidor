const SetExpDate = (oldDate = Date.now(), quantity = 0, type = "h") => {
    let newDate = oldDate
    switch (type.toLowerCase()) {
        case "m":
                newDate = oldDate + quantity * 1000 * 60
            break;
        case "h":
                newDate = oldDate + quantity * 1000 * 60 * 60
            break;
        case "d":
                newDate = oldDate + quantity * 1000 * 60 * 60 * 24
            break;
        default:
            break;
    }
    return newDate
}
module.exports = SetExpDate