// Netlify, postman

let rank = "Super user or Owner";

exports.handler = function(event, context, callback) {
    const secretContent = `
    <h3>Server Side Terminal Activated</h3>
    <p>Permission rank: ${rank}</p>
    `
    let body;

    if (event.body) {
        body = JSON.parse(event.body)
    } else {
        body = {}
    }

    if (body.password == "javascript") {
        callback(null, {
            statusCode: 200,
            body: secretContent
        })
        } else {
    callback(null, {
            statusCode: 401
        })
    }

}