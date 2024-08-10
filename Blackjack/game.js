let msg
let cards
let sum
let cardList
let aceCounter
let imgs

let div = document.getElementById("card-list")
let completelist= document.getElementById("card-lists");

document.querySelector("#card").textContent = "Cards: "
document.querySelector("#sum").textContent = "Sum: "


function genRand() {
    let r = Math.floor(Math.random() * (imgs.length-1))
    let random = imgs[r][0]
    r= Math.ceil(Math.random() * (imgs.length-1))
    random = imgs[r]

    imgs.splice(r,1)   

    return random
}

function start(){
    imgs = [
    [2,"images/club/k2.jpg"], 
    [3,"images/club/k3.jpg"], 
    [4,"images/club/k4.jpg"], 
    [5,"images/club/k5.jpg"], 
    [6,"images/club/k6.jpg"], 
    [7,"images/club/k7.jpg"], 
    [8,"images/club/k8.jpg"], 
    [9,"images/club/k9.jpg"], 
    [10,"images/club/k10.jpg"], 
    [10,"images/club/kj.jpg"], 
    [10,"images/club/kq.jpg"], 
    [10,"images/club/kk.jpg"], 
    [11,"images/club/k1.jpg"],
    [2,"images/dia/i2.jpg"], 
    [3,"images/dia/i3.jpg"], 
    [4,"images/dia/i4.jpg"], 
    [5,"images/dia/i5.jpg"], 
    [6,"images/dia/i6.jpg"], 
    [7,"images/dia/i7.jpg"], 
    [8,"images/dia/i8.jpg"], 
    [9,"images/dia/i9.jpg"], 
    [10,"images/dia/i10.jpg"], 
    [10,"images/dia/ij.jpg"], 
    [10,"images/dia/iq.jpg"], 
    [10,"images/dia/ik.jpg"], 
    [11,"images/hrt/s1.jpg"],
    [2,"images/hrt/s2.jpg"], 
    [3,"images/hrt/s3.jpg"], 
    [4,"images/hrt/s4.jpg"], 
    [5,"images/hrt/s5.jpg"], 
    [6,"images/hrt/s6.jpg"], 
    [7,"images/hrt/s7.jpg"], 
    [8,"images/hrt/s8.jpg"], 
    [9,"images/hrt/s9.jpg"], 
    [10,"images/hrt/s10.jpg"], 
    [10,"images/hrt/sj.jpg"], 
    [10,"images/hrt/sq.jpg"], 
    [10,"images/hrt/sk.jpg"], 
    [11,"images/hrt/s1.jpg"],
    [2,"images/spd/p2.jpg"], 
    [3,"images/spd/p3.jpg"], 
    [4,"images/spd/p4.jpg"], 
    [5,"images/spd/p5.jpg"], 
    [6,"images/spd/p6.jpg"], 
    [7,"images/spd/p7.jpg"], 
    [8,"images/spd/p8.jpg"], 
    [9,"images/spd/p9.jpg"], 
    [10,"images/spd/p10.jpg"], 
    [10,"images/spd/pj.jpg"], 
    [10,"images/spd/pq.jpg"], 
    [10,"images/spd/pk.jpg"], 
    [11,"images/spd/p1.jpg"]
]
document.querySelector("#card").textContent = "Cards: "
    document.querySelector("#sum").textContent = "Sum: "
    cards = []
    sum = 0
    cardList = ""
    aceCounter = 0

    cards.push(genRand())
    cards.push(genRand())

    renderGame()
}
function renderGame(){
    sum=0
    aceCounter=0
    completelist.innerHTML = ""
    for (i=0; i<cards.length; i+=1){
        sum += parseInt(cards[i][0])
        if (cards[i][1] ==="images/club/k1.jpg" ||
            cards[i][1] === "images/dia/i1.jpg"||
            cards[i][1] === "images/hrt/s1.jpg"||
            cards[i][1] === "images/spd/p1.jpg"){
            aceCounter += 1

        }
        completelist.innerHTML += "<li><img src=\'"+cards[i][1]+"\'></li>"
    }
    if(sum>21){
        sum-=aceCounter*10

    }

    if (sum<21){
        msg="Do you want to draw a new card?"
        document.querySelector("#newBtn").disabled = false
    }

    else if(sum===21){
        msg="Black Jack!!!"
        document.querySelector("#newBtn").disabled = true
        document.querySelector("#stBtn").textContent = "NEW GAME"
    }


    else{
        msg="You are out of the game"
        document.querySelector("#newBtn").disabled = true
        document.querySelector("#stBtn").textContent = "NEW GAME"

    }
    document.querySelector("#greeting").textContent = msg
    document.querySelector("#sum").textContent += sum

}
function newCard(){
    document.querySelector("#card").textContent = "Cards: "
    document.querySelector("#sum").textContent = "Sum: "
    cards.push(genRand(cards))
    renderGame()
}