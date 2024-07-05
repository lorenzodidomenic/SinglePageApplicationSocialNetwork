




const server = io()

container = document.getElementById("container")
loginContainer = document.getElementById("loginContainer")
btn_login = document.getElementById("btn_login")
btn_register = document.getElementById("btn_register")
container_main = document.getElementById("container_main")

username_input = document.getElementById("username")
password_input = document.getElementById("password")

post_text = document.getElementById("post_text")
btnPost = document.getElementById("btnPost")

container_posts = document.getElementById("container_posts")

btnMyPost = document.getElementById("btnMyPost")
searchTxt = document.getElementById("search_txt")
btnLogout = document.getElementById("btnLogout")
btnSearch = document.getElementById("btnSearch")
btnHome = document.getElementById("btnHome")


username = ""


btn_register.addEventListener("click", ()=>{
    username = this.username_input.value
    password = this.password_input.value
    server.emit("reg",{username: username, password: username});
    this.username_input.value = ""
    this.password_input.value = ""
})


server.on("reg_ok", ()=>{
    span_ok = document.createElement("span")
    span_ok.innerHTML = "Registrazione andata a buon fine"
    span_ok.style.color="blue"
    container.appendChild(span_ok)
    setTimeout(()=>{
        span_ok.innerHTML = ""
    }, 2000) 
})

server.on("reg_no_ok", ()=>{
    span_no_ok = document.createElement("span")
    span_no_ok.innerHTML = "Username non disponibile"
    span_no_ok.style.color="red"
    container.appendChild(span_no_ok)
    setTimeout(()=>{
        span_no_ok.innerHTML = ""
    }, 4000) 
})

btn_login.addEventListener("click", ()=>{
    username = this.username_input.value
    password = this.password_input.value
    server.emit("log",{username: username, password: username});

    this.username_input.value = ""
    this.password_input.value = ""
})


server.on("log_ok", ()=>{
    loginContainer.style.display = "none"
   container_main.style.display = "block"
})

server.on("no_log_ok", ()=>{
    span_no_ok = document.createElement("span")
    span_no_ok.innerHTML = "Credenziali sbagliate"
    span_no_ok.style.color="red"
    container.appendChild(span_no_ok)
    setTimeout(()=>{
        span_no_ok.innerHTML = ""
    }, 4000) 
})


btnPost.addEventListener("click", async  ()=>{

    //faccio richiesta post al server e alla api

    /* faccio richeista Post Con username e testo da postare */ 

    // Example POST method implementation:
 const data = { username: username, post: this.post_text.innerHTML };
 await fetch('http://localhost:8081/post', {
   method: 'POST', // or 'PUT'
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(data),
 })

})


server.on("new_single_post", (message)=>{
    

    /* all'arrivo di un nuovo post creo un div che contiene il post*/


    new_post = document.createElement("span");
 
    color ="white"
    if(message.username == username)
        color = "green"

   
    new_post.innerHTML =     ' <div id="new_post" style="background-color:'+color+'"> \
                     <span id="username"><b>@'+  message.username  + '</b></span> \
                     <div id="post_content"> ' + message.content + ' \
                       </div> '

    container_posts.appendChild(new_post)

})


server.on("list_post", (message)=>{

    for(let i = 0; i<message.length; i++){
    
    new_post = document.createElement("span");


    new_post.innerHTML =     ' <div id="new_post" style="background-color:white"> \
                     <span id="username"><b>@'+  message[i].username  + '</b></span> \
                     <div id="post_content"> ' + message[i].content + ' \
                       </div> '

    container_posts.appendChild(new_post)
    }


})



//la ricerca dei miei post la faccio con un query get e mando il mio username
//broken access control
btnMyPost.addEventListener("click", async ()=>{

    //devo fare una fetch alla route di get post e ottengo i imiei post
    response = await fetch("http://localhost:8081/post?username="+username)
    response = await response.json()

    //svuoto il container dei post e metto solo i post miei 
    this.container_posts.innerHTML = ""
    header_profile = document.createElement("span");
    header_profile.classList=["header_profile"]
    header_profile.innerHTML = response[0].username
    container_posts.appendChild(header_profile)

    for(let i = 0; i<response.length; i++){
    
        new_post = document.createElement("span");
    
    
        new_post.innerHTML =     ' <div id="new_post" style="background-color:white"> \
                         <span id="username"><b>@'+  response[i].username  + '</b></span> \
                         <div id="post_content"> ' + response[i].content + ' \
                           </div> '
    
        container_posts.appendChild(new_post)
    }
})

//la richiesta dei post di un determinato username lo faccio inevece con il body
btnSearch.addEventListener("click", async ()=>{
  
    response = await fetch("http://localhost:8081/post_user/"+this.search_txt.value)
    response = await response.json()


      //svuoto il container dei post e metto solo i post miei 
 
  
    
      if(response.length == 0){

         this.container_posts.innerHTML = ""

        new_post = document.createElement("span");
      
      
        new_post.innerHTML =     ' nessun utente torvato '
        new_post.style.color = 'red'
        new_post.style.text_align = 'center'
        new_post.style.display = 'block'
        new_post.style.width = "100%"

    
        container_posts.appendChild(new_post)
      }else{

        this.container_posts.innerHTML = ""
        header_profile = document.createElement("span");
        header_profile.classList=["header_profile"]
        header_profile.innerHTML = response[0].username
        container_posts.appendChild(header_profile)

      for(let i = 0; i<response.length; i++){
      
          new_post = document.createElement("span");
      
      
          new_post.innerHTML =     ' <div id="new_post" style="background-color:white"> \
                           <span id="username"><b>@'+  response[i].username  + '</b></span> \
                           <div id="post_content"> ' + response[i].content + ' \
                             </div> '
      
          container_posts.appendChild(new_post)
      }

    }
})

btnHome.addEventListener("click", ()=>{
    server.emit("all_search");
})

server.on("all_search_ok", (message)=>{
    
    for(let i = 0; i<message.length; i++){
    
        new_post = document.createElement("span");
    
    
        new_post.innerHTML =     ' <div id="new_post" style="background-color:white"> \
                         <span id="username"><b>@'+  message[i].username  + '</b></span> \
                         <div id="post_content"> ' + message[i].content + ' \
                           </div> '
    
        container_posts.appendChild(new_post)
        }
    
})


btnLogout.addEventListener("click", ()=>{
     loginContainer.style.display = "block"
   container_main.style.display = "none"
})