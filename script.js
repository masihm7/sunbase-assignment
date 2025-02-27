const formcontainer =  document.getElementById("formcontainer")
const togglebtn = document.getElementById("togglebtn")
const saveformbtn = document.getElementById("saveformbtn")
const inputform = document.getElementById("inputform");
const selectform = document.getElementById("selectform");
const textareaform = document.getElementById("textareaform");
const parentdiv = document.querySelectorAll(".parentdiv > div:first-child");


let orderchange = []
let modeflag = localStorage.getItem("darkMode") === "true";
const navbar = document.getElementById("navbar");
const controls = document.getElementById("controls")
const container = document.getElementById("container")
const headings = document.querySelectorAll("h2")

if(modeflag){
    navbar.classList.toggle("dark-mode");
    controls.classList.toggle("dark-mode")
    container.classList.toggle("dark-mode")
    headings.forEach(h => {
        h.classList.toggle("headingsdark")
    });
    togglebtn.innerHTML = "Light Mode";
}



// handle the display none in the side bar
parentdiv.forEach(function (parent) {
    parent.addEventListener("click", function () {
        const hidiv = this.nextElementSibling;
        if (hidiv) {
            hidiv.className = hidiv.className === "hide" ? "show" : "hide";
        }
    });
});

// handle the forms form new cards
const handleinputform = async(e) => {
    e.preventDefault();
    const type = "input";
    const label = e.target[0].value;
    const placeholder = e.target[1].value;
    const id = Math.random();
    const res = await fetch("http://localhost:3000/formElements");
    const data = await res.json();
    const order = data.length+1
    const obj = { id, type, label, placeholder,order };
    await fetch("http://localhost:3000/formElements", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(obj)
    });
    fetchdata();
    console.log("Data successfully posted:", obj);
};

const handleselectform = async(e) => {
    e.preventDefault();
    const type = "select";
    const label = e.target[0].value;
    const option1 = e.target[1].value;
    const option2 = e.target[2].value;
    const option3 = e.target[3].value;
    const options = [option1,option2,option3]
    const id = Math.random();
    const res = await fetch("http://localhost:3000/formElements");
    const data = await res.json();
    const order = data.length+1
    const obj = { id, type, label, options,order };
    console.log(options)
    await fetch("http://localhost:3000/formElements", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(obj)
    });
    fetchdata();
    console.log("Data successfully posted:", obj);
};

const handletextareaform = async(e) => {
    e.preventDefault();
    const type = "textarea";
    const label = e.target[0].value;
    const placeholder = e.target[1].value;
    const id = Math.random();
    const res = await fetch("http://localhost:3000/formElements");
    const data = await res.json();
    const order = data.length+1
    const obj = { id, type, label, placeholder,order };
    await fetch("http://localhost:3000/formElements", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(obj)
    });
    fetchdata();
    console.log("Data successfully posted:", obj);
};


inputform.addEventListener("submit", (e)=>handleinputform(e));
selectform.addEventListener("submit", (e)=>handleselectform(e));
textareaform.addEventListener("submit", (e)=>handletextareaform(e));

//handle the ui for the formcontainer
fetchdata =async()=>{
    try {
        const res = await fetch("http://localhost:3000/formElements")
        const data = await res.json()
        data.sort((a, b) => a.order - b.order);
        // console.log(data)
        showdata(data)
    } catch (error) {
        console.log(error)
    }
}
fetchdata()

const handledelete = async(id)=>{
    await fetch(`http://localhost:3000/formElements/${id}`, {
        method: "DELETE",
    });
    console.log(`Element with ID ${id} deleted`);
    fetchdata();
}

const showdata=(arr)=>{
    formcontainer.innerHTML=""

    arr.forEach((ele)=>{
        let cards = document.createElement('div')
        cards.id = "cards"
        cards.className = "draggable";
        cards.draggable = true;
        cards.setAttribute("data-id", ele.id); 
        cards.addEventListener("dragstart", () => {
            cards.classList.add("dragging");
        });

        cards.addEventListener("dragend", async() => {
            cards.classList.remove("dragging");
            const elements = [...formcontainer.querySelectorAll(".draggable")];
        orderchange = elements.map((el, index) => ({
        id: el.getAttribute("data-id"),
        order: index + 1
    }));
    console.log("changed order",orderchange)
        });
        let label = document.createElement("label")
        let deletebtn = document.createElement("span")
        // editbtn = document.createElement("span")
        // editbtn.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: #636363;"></i>`
        deletebtn.innerHTML = `<i class="fa-solid fa-trash" style="color: #4f4f4f;"></i>`

        deletebtn.addEventListener("click",()=>{handledelete(ele.id)})
        let din = document.createElement('div')
        din.id = "din"
        let btns = document.createElement("div")
        btns.id = 'edbtns'
        btns.append(deletebtn)
        din.append(label,btns)

        cards.append(din)
        label.innerHTML = ele.label
        if (ele.type === "input"){
            let input = document.createElement("input")
            input.placeholder = ele.placeholder
            cards.append(input)
        }
        else if (ele.type === "select"){
            let select = document.createElement("select")
            ele.options.forEach(opt => {
                let option = document.createElement("option");
                option.innerText = opt;
                select.append(option); 
            });
            cards.append(select) 
        }
        else if (ele.type === "textarea") {
            let textarea = document.createElement("textarea");
            textarea.placeholder = ele.placeholder;
            cards.append(textarea);
        }
        else if (ele.type === "checkbox") {
            let checkboxconte = document.createElement("div")
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox"
            checkboxconte.append(checkbox);
            cards.append(checkboxconte)
        }
        
        formcontainer.append(cards) 
    })

}

// darg and drop code
//  handle that when the dragged card is dropped is placed at right point
formcontainer.addEventListener("dragover",e=>{
    e.preventDefault()
    const afterelement = getdragafterelement(formcontainer, e.clientY)
    const draggable = document.querySelector(".dragging")
    if(afterelement==null){
        formcontainer.appendChild(draggable)
    }else{
        formcontainer.insertBefore(draggable,afterelement)
    }
})

function getdragafterelement(container,y){
    const draggableelements = [...container.querySelectorAll(".draggable:not(.dragging)")]
    return draggableelements.reduce((closest,child)=>{
        const box = child.getBoundingClientRect()
        const offset = y-box.top-box.height/2
        if(offset<0 && offset> closest.offset){
            return {offset: offset,element:child}
        }else{
           return closest
        }
    },{offset: Number.NEGATIVE_INFINITY}).element
} 

// handle the save btn function 
async function saveorderchange(){
    console.log("btn clicked")
    if(orderchange.length < 1){
        console.log("no order to change")
    }
    for (let ele of orderchange) {
        await fetch(`http://localhost:3000/formElements/${ele.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: ele.order })
        });
    }
    console.log("ordersaved")
    orderchange = []
}
saveformbtn.addEventListener("click", saveorderchange)


togglebtn.addEventListener("click",()=>{
    modeflag = !modeflag
    navbar.classList.toggle("dark-mode");
    controls.classList.toggle("dark-mode")
    container.classList.toggle("dark-mode")
    headings.forEach(h => {
        h.classList.toggle("headingsdark")
    });
    localStorage.setItem("darkMode", modeflag);
    togglebtn.innerHTML = modeflag ?  "Light Mode" :"Dark Mode"
})