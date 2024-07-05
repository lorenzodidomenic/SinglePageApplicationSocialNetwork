const express = require("express")
const {createServer} = require("http")
const {Server} = require("socket.io")




const app = express();
app.use(express.static("./www"))
app.use(express.json());

const HttpServer = createServer(app)

const server = new Server(HttpServer)

users = []
posts = []

class User{

    username;
    password;
    socket_id;

    constructor(username,password,socket_id){
        this.username = username;
        this.password = password;
        this.socket_id = socket_id;
    }

}

class Post{

    username;
    content;
    id;

    constructor(username,content){
        this.username = username;
        this.content = content;
    }
}

server.on("connection", (socket)=>{

        if(posts.length > 0){
            socket.emit("list_post",posts)
        }

    socket.on("reg", (message)=>{
        //creo nuovo utente e lo aggiugno alla lista
        user = new User(message.username,message.password,socket.id)


        exist = false;
        empty = false;
        if(!message.username){
            socket.emit("reg_no_ok")
            empty = true;
        }
        //controllo se già esiste username
        for(a of users){
            if(a.username == message.username){
                exist = true;
            }
        }

        if(!exist && !empty){
        users.push(user)
        socket.emit("reg_ok")
        }else if(!empty){
            socket.emit("reg_no_ok")
        }

        /* quando una socket si connette gli mando l'array di post vecchi*/

        /* occhio li devo controllare se li ho già mandati */

    })


    socket.on("log", (message)=>{
        
        find = false;


        for(x of users){
            if((x.username == message.username) && (x.password == message.password)){
                x.socket_id = socket.id;
                socket.emit("log_ok")
                //genero evento log_ok
                find = true;

                break;

            }
        }

        if(!find){
            socket.emit("no_log_ok")
            //genero evento no log ok
        }
    })


    socket.on("all_search", ()=>{

        socket.emit("all_search_ok",posts)
    })
})


app.post("/post",(req,res)=>{
    console.log(req.body.username)
    post = new Post(req.body.username, req.body.post)
    posts.push(post)
    server.sockets.emit("new_single_post",post)
})

app.get("/post",(req,res)=>{
   
    post_user = []
   
    //mi scorro la lista dei post e mi prendo solo quelli dell'username lorenzo
    for(p of posts){
      if(p.username == req.query["username"])
        post_user.push(p)
    }

    res.send(post_user)
})


app.get("/post_user/:id", (req,res)=>{
    

    post_user = []
    for(p of posts){
        if(p.username == req.params["id"])
          post_user.push(p)
      }


      res.send(post_user);

})


HttpServer.listen(8081)