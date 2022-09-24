const app = document.querySelector('#app');
console.log(app)
app.innerHTML = nav();


function nav(){
    return `<nav class="container">
                <ul class="nav nav-pills">
                    <li class="nav-item">
                    <a onclick="navTo(this)"  data-target='home' class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                    <a onclick="navTo(this)"  data-target='reports' class="nav-link"  href="#">Live Reports</a>
                    </li>
                    <li class="nav-item">
                    <a onclick="navTo(this)"  data-target='about' class="nav-link" href="#">About</a>
                    </li>
                </ul>
            </nav>`
}

function navTo(elem){
    let target = elem.dataset.target;
    console.log(target);
    document.querySelectorAll('.nav-item > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
}