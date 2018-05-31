import React, { Component } from 'react';

const apikey = 'b62894780d7c4372a25ff3e246ca4026';
const main = document.querySelector('main');
const rullgardin = document.querySelector('#rullgardin');


window.addEventListener('load' , e => {
    updateSources();
});

rullgardin.onchange = function(event) {
    uppdateNews(event.target.value);
};

if('serviceWorker' in navigator){
    try {
        navigator.serviceWorker.register('/sw.js');
        console.log(`SW registered`);
    } catch (error) {
        console.log(`SW reg faild`);
    }
};

async function updateSources() {
    const res = await fetch (`https://newsapi.org/v1/sources`);
    const json = await res.json();

    rullgardin.innerHTML = json.sources
    .map(src => `<option value="${src.id}">${src.name}</option>`)
    .join('\n');

    uppdateNews();
}
async function uppdateNews(id) {
    let sources = id;
    if (id === undefined) {
        sources = [...document.querySelectorAll('#rullgardin option')].map(function(o) {return o.value}).join(',');
    }

    try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${apikey}`);
        const json = await res.json();

        main.innerHTML = json.articles.map(createArticle).join('\n');
    } catch(e) {
        main.innerHTML = `<p>You are offline, please check connection and try again...</p>`
    }
}

function createArticle(article){
    return `
        <div class="article">
        <a href="${article.url}">
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        </a>
        </div>
    `;
}

export default class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <p>Loading articles/Laddar artiklar...</p>
        );
    }
}
