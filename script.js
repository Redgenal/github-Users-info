class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

async function loadJson(url) {
    let response = await fetch(url);

    if (response.status == 200)
        return (await response.json());
    else
        throw new HttpError(response);
}

async function getUser() {
    let user;

    while (true) {
        let name = prompt("Enter nick of Github user", "");
        try {
            user = await loadJson(`https://api.github.com/users/${name}`);
            break ;
        }
        catch (err) {
            if (err instanceof HttpError)
                alert("No such user, try again");
            else
                throw err;
        }
    }
    return user;
}

async function main() {
    let gitUser = await getUser();

    let promise = new Promise((resolve, reject) => {
        let img = document.createElement("img");
        img.src = gitUser.avatar_url;
        img.classList = "photo";
        document.querySelector(".container").append(img);
        let p = document.createElement('P');
        p.innerHTML = (gitUser.name || "Name not specified");
        document.querySelector(".container").append(p);
    });
}

main();